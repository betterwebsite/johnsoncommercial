import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Box,
  Card,
  Stack,
  Text,
  Button,
  Flex,
  Grid,
  TextInput,
} from '@sanity/ui'
import {PatchEvent, set, useFormValue} from 'sanity'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {nanoid} from 'nanoid'

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type FieldItem = {
  id: string
  displayName: string
  value: string
  isCustom?: boolean
}

type TableValue = {
  fields: FieldItem[]
  removedFieldIds: string[]
}

/* ------------------------------------------------------------------ */
/*  Empty preset - no defaults                                        */
/* ------------------------------------------------------------------ */

const EMPTY_PRESET: FieldItem[] = []

/* ------------------------------------------------------------------ */
/*  EXTRA FIELDS SHOWN UNDER "Add fields"                             */
/* ------------------------------------------------------------------ */

const PRICE_EXTRA: FieldItem[] = [
  {id: 'sale_price',  displayName: 'Sale Price', value: ''},
  {id: 'lease_rate',  displayName: 'Lease Rate', value: ''},
  {id: 'price_per',   displayName: 'Price Per SF', value: ''},
  {id: 'nnn_rate',    displayName: 'NNN Rate', value: ''},
  {id: 'cam_fee',     displayName: 'CAM Fee', value: ''},
]

const MISC_EXTRA: FieldItem[] = [
  {id: 'traffic',   displayName: 'Traffic Count', value: ''},
  {id: 'caprate',   displayName: 'CAP Rate', value: ''},
  {id: 'zoning',    displayName: 'Zoning', value: ''},
  {id: 'parcelid',  displayName: 'Parcel ID', value: ''},
]

const BUILDING_EXTRA: FieldItem[] = [
  {id: 'square_feet', displayName: 'Size', value: ''},
  {id: 'lot_size',    displayName: 'Lot Size', value: ''},
  {id: 'year_built',  displayName: 'Year Built', value: ''},
]

const PALETTE = [...PRICE_EXTRA, ...MISC_EXTRA, ...BUILDING_EXTRA]

/* ------------------------------------------------------------------ */
/*  Sortable item component                                           */
/* ------------------------------------------------------------------ */

function SortableFieldItem({
  field,
  onUpdateField,
  onRemoveField,
}: {
  field: FieldItem
  onUpdateField: (id: string, f: FieldItem) => void
  onRemoveField: (id: string) => void
}) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable(
    {id: field.id}
  )

  const style = {transform: CSS.Translate.toString(transform), transition}

  // Handle click explicitly to ensure it's captured
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveField(field.id);
  };

  // Display the field ID in red text above the field
  const fieldIdText = field.isCustom ? 'Custom Field' : field.id;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Field ID display */}
      <Text size={1} style={{color: 'white', marginBottom: -23, marginRight: 15, textAlign: 'right'}}>
        {fieldIdText}
      </Text>
      
      <Card marginBottom={2} padding={0} radius={2} border>
        <Grid columns={[1, 1, 1]} gap={0}>
          <Box style={{cursor: 'grab', padding: 10}} {...listeners}>
            <Text size={2}>≡</Text>
          </Box>

          <Box padding={3}>
            <TextInput
              value={field.displayName}
              onChange={e =>
                onUpdateField(field.id, {...field, displayName: e.target.value})
              }
              placeholder="Field Name"
            />
          </Box>

          <Flex align="center" padding={3}>
            <Box flex={1} paddingRight={2}>
              <TextInput
                value={field.value || ''}
                onChange={e =>
                  onUpdateField(field.id, {
                    ...field,
                    value: e.target.value,
                  })
                }
                placeholder="Value"
              />
            </Box>
            <Button
              fontSize={1}
              padding={2}
              mode="ghost"
              tone="critical"
              text="×"
              onClick={handleRemoveClick}
            />
          </Flex>
        </Grid>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Table preview                                                     */
/* ------------------------------------------------------------------ */

function TablePreview({
  fields,
}: {
  fields: FieldItem[]
}) {
  return (
    <Card padding={0} marginTop={4} radius={2} border>
      <Box padding={2} style={{background: '#c14545'}}>
        <Text size={2} weight="semibold" style={{color: 'white'}}>
          DETAILS
        </Text>
      </Box>

      <Stack>
        {fields.filter(f => f.id !== 'property_type').map(f => (
          <Grid
            key={f.id}
            columns={[2]}
            padding={3}
            style={{borderBottom: '1px solid #333'}}
          >
            <Box>
              <Text size={1} weight="semibold">
                {f.displayName}
              </Text>
            </Box>
            <Box>
              <Text size={1} style={{textAlign: 'right'}}>
                {f.value || ''}
              </Text>
            </Box>
          </Grid>
        ))}
      </Stack>
    </Card>
  )
}
/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function DetailsTableInput(props: any) {
  const {value, onChange, readOnly} = props
  
  // For debugging
  const [lastAction, setLastAction] = useState<string>('');
  
  /* ---------------- one-shot reload helper ------------------------ */
  function reloadOnceOnError(err: unknown) {
    const FLAG = '__details_table_reloaded__'
    if (!sessionStorage.getItem(FLAG)) {
      console.error('DetailsTableInput crashed → hard-refreshing…', err)
      sessionStorage.setItem(FLAG, 'true')
      setTimeout(() => window.location.reload(), 50)
    } else {
      console.error('Second crash detected – NOT reloading again.', err)
    }
  }

  /* ---------------- safePatch wrapper ----------------------------- */
  const safePatch = useCallback(
    (pe: PatchEvent) => {
      if (readOnly) {
        console.log('Not patching because readOnly is true');
        return;
      }
      
      try {
        onChange(pe);
        setLastAction('Patch applied successfully');
      } catch (err) {
        console.error('Error applying patch:', err);
        setLastAction(`Error: ${err}`);
        reloadOnceOnError(err);
      }
    },
    [onChange, readOnly],
  )

  /* ---------------- form hooks ------------------------------------ */
  const listingType = useFormValue(['listing_type']) as string

  /* ---------------- local UI state -------------------------------- */
  const [customName, setCustomName] = useState('')
  const [customVal, setCustomVal] = useState('')
  
  // Keep local state to avoid re-render issues with Sanity
  const [localFields, setLocalFields] = useState<FieldItem[]>([])
  const firstRenderRef = useRef(true)

  /* ---------------- use empty preset ------------------ */
  const currentPreset = useMemo(() => {
    return EMPTY_PRESET
  }, [])

  /* ---------------- handle TableValue ------------------------- */
  const tableValue: TableValue = value || {
    fields: [],
    removedFieldIds: []
  }
  
  const removedFieldIds = tableValue.removedFieldIds || []
  
  // Initialize fields on first render if needed
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      
      // If no fields defined yet, use the current preset
      if (!tableValue.fields || tableValue.fields.length === 0) {
        const initialFields = currentPreset
        setLocalFields(initialFields)
        
        // Update Sanity document
        safePatch(PatchEvent.from(set({
          fields: initialFields,
          removedFieldIds: []
        })))
        
      } else {
        // Use existing fields
        setLocalFields(tableValue.fields)
      }
    }
  }, [currentPreset, tableValue, safePatch])
  
  const previousType = useRef<string | null>(null)

  // Removed effect for changing presets based on listing type
  // We're now using an empty preset regardless of listing type

  // Update local fields when value changes from outside
  useEffect(() => {
    if (!firstRenderRef.current && tableValue.fields) {
      setLocalFields(tableValue.fields)
    }
  }, [tableValue.fields])

  /* ---------------- drag-and-drop sensors ------------------------- */
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  /* ---------------- event handlers -------------------------------- */
  const updateField = useCallback(
    (id: string, updated: FieldItem) => {
      const newFields = localFields.map(f => (f.id === id ? updated : f));
      setLocalFields(newFields);
      
      safePatch(PatchEvent.from(set({
        fields: newFields,
        removedFieldIds
      })));
      
      setLastAction(`Updated field: ${id}`);
    },
    [localFields, removedFieldIds, safePatch]
  )

  const removeField = useCallback(
    (id: string) => {
      // Remove from local fields
      const newFields = localFields.filter(f => f.id !== id);
      setLocalFields(newFields);
      
      // Add to removedFieldIds to prevent auto-adding
      const newRemovedFieldIds = [...removedFieldIds];
      if (!newRemovedFieldIds.includes(id)) {
        newRemovedFieldIds.push(id);
      }
      
      // Update Sanity document
      safePatch(PatchEvent.from(set({
        fields: newFields,
        removedFieldIds: newRemovedFieldIds
      })));
      
      setLastAction(`Removed field: ${id}`);
    },
    [localFields, removedFieldIds, safePatch]
  )

  const addField = useCallback(
    (f: FieldItem) => {
      // Check if we should preserve any existing value
      const existingField = localFields.find(field => field.id === f.id);
      const newField = {
        ...f,
        value: existingField?.value || f.value
      };
      
      // Add to local fields
      const newFields = [...localFields, newField];
      setLocalFields(newFields);
      
      // Remove from removedFieldIds
      const newRemovedFieldIds = removedFieldIds.filter(id => id !== f.id);
      
      // Update Sanity document
      safePatch(PatchEvent.from(set({
        fields: newFields,
        removedFieldIds: newRemovedFieldIds
      })));
      
      setLastAction(`Added field: ${f.id}`);
    },
    [localFields, removedFieldIds, safePatch]
  )

  const addCustom = useCallback(() => {
    if (!customName) return;
    
    const f: FieldItem = {
      id: `custom_${nanoid(6)}`,
      displayName: customName,
      value: customVal,
      isCustom: true,
    };
    
    // Add to local fields
    const newFields = [...localFields, f];
    setLocalFields(newFields);
    
    // Update Sanity document
    safePatch(PatchEvent.from(set({
      fields: newFields,
      removedFieldIds
    })));
    
    setCustomName('');
    setCustomVal('');
    setLastAction(`Added custom field: ${customName}`);
  }, [customName, customVal, localFields, removedFieldIds, safePatch])

  const onDragEnd = useCallback(
    (e: any) => {
      const {active, over} = e;
      if (active.id === over.id) return;
      
      const oldIdx = localFields.findIndex(f => f.id === active.id);
      const newIdx = localFields.findIndex(f => f.id === over.id);
      const newFields = arrayMove(localFields, oldIdx, newIdx);
      
      setLocalFields(newFields);
      
      safePatch(PatchEvent.from(set({
        fields: newFields,
        removedFieldIds
      })));
      
      setLastAction(`Reordered fields: moved ${active.id} to position ${newIdx}`);
    },
    [localFields, removedFieldIds, safePatch]
  )

  // Calculate unused fields, excluding removed fields
  const unused = useMemo(() => {
    return PALETTE.filter(p => 
      !localFields.some(f => f.id === p.id) && 
      !removedFieldIds.includes(p.id)
    );
  }, [localFields, removedFieldIds]);

  // Calculate removed fields that could be added back
  const removedFields = useMemo(() => {
    return PALETTE.filter(p => 
      !localFields.some(f => f.id === p.id) && 
      removedFieldIds.includes(p.id)
    );
  }, [localFields, removedFieldIds]);

  /* ---------------- render ---------------------------------------- */
  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>
        <Text weight="semibold">Property Details:</Text>
        
        {/* Debug info - uncomment for debugging */}
        {lastAction && (
          <Box padding={2} style={{background: '#f0f0f0', fontSize: '12px', color: 'black', display: 'none'}}>
            Last action: {lastAction}
          </Box>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={localFields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {localFields.map(f => (
              <SortableFieldItem
                key={f.id}
                field={f}
                onUpdateField={updateField}
                onRemoveField={removeField}
              />
            ))}
          </SortableContext>
        </DndContext>

        {(unused.length > 0 || removedFields.length > 0) && (
          <Box>
            <Text weight="semibold" style={{marginBottom: 10}}>
              Add fields:
            </Text>
            <Flex wrap="wrap" gap={2}>
              {/* Regular unused fields */}
              {unused.map(f => (
                <Button
                  key={f.id}
                  text={f.displayName}
                  tone="primary"
                  mode="ghost"
                  onClick={() => addField(f)}
                />
              ))}
              
              {/* Previously removed fields */}
              {removedFields.map(f => (
                <Button
                  key={f.id}
                  text={f.displayName}
                  tone="caution" // Different tone for removed fields
                  mode="ghost"
                  onClick={() => addField(f)}
                />
              ))}
            </Flex>
          </Box>
        )}

        <Box marginTop={2}>
          <Text weight="semibold" style={{marginBottom: 10}}>
            Add Custom Field:
          </Text>
          <Grid columns={[1, 3]} gap={2}>
            <TextInput
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="Field Title"
            />
            <TextInput
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              placeholder="Field Value"
            />
            <Button
              text="Add"
              tone="primary"
              disabled={!customName}
              onClick={addCustom}
            />
          </Grid>
        </Box>

        <TablePreview fields={localFields} />
      </Stack>
    </Card>
  )
}