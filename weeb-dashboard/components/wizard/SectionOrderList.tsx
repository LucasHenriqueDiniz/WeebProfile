"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { SectionConfigDialog } from "./SectionConfigDialog"

interface SectionOrderListProps {
  sections: string[]
  plugin: string
  availableSections: Array<{ id: string; name: string; description?: string }>
  pluginConfig?: Record<string, any>
  onReorder: (newOrder: string[]) => void
  onSectionConfigChange?: (sectionId: string, config: Record<string, any>) => void
}

function SortableSectionItem({ 
  id, 
  name, 
  description,
  plugin,
  sectionConfig,
  onConfigChange,
}: { 
  id: string
  name: string
  description?: string
  plugin: string
  sectionConfig?: Record<string, any>
  onConfigChange?: (config: Record<string, any>) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all",
        isDragging && "shadow-lg ring-2 ring-primary"
      )}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-1 min-w-0">
                <Badge variant="secondary" className="text-xs font-medium">
                  {name}
                </Badge>
                {description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {description}
                  </p>
                )}
              </div>
            </TooltipTrigger>
            {description && (
              <TooltipContent>
                <p className="max-w-xs">{description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {!isDragging && onConfigChange && (
          <SectionConfigDialog
            plugin={plugin}
            section={{ id, name }}
            sectionConfig={sectionConfig || {}}
            onConfigChange={onConfigChange}
          />
        )}
        {isDragging && (
          <span className="text-xs text-primary font-semibold">Arrastando...</span>
        )}
      </CardContent>
    </Card>
  )
}

export function SectionOrderList({ 
  sections, 
  plugin,
  availableSections, 
  pluginConfig,
  onReorder,
  onSectionConfigChange,
}: SectionOrderListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Criar mapa de seções disponíveis para buscar nome e descrição
  const sectionsMap = new Map(
    availableSections.map((s) => [s.id, s])
  )

  // Filtrar apenas seções selecionadas e criar itens ordenados
  const orderedSections = sections
    .map((id) => {
      const section = sectionsMap.get(id)
      return section
        ? {
            id,
            name: section.name,
            description: section.description,
          }
        : null
    })
    .filter((item) => item !== null) as Array<{ id: string; name: string; description?: string }>

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = orderedSections.findIndex((item) => item.id === active.id)
      const newIndex = orderedSections.findIndex((item) => item.id === over.id)

      const newOrder = arrayMove(orderedSections, oldIndex, newIndex).map((item) => item.id)

      onReorder(newOrder)
    }
  }

  if (orderedSections.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Nenhuma seção selecionada
      </div>
    )
  }

  if (orderedSections.length === 1) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        Adicione mais seções para poder reorganizar
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedSections.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {orderedSections.map((item) => {
            // Get section config from plugin config using new structure
            const sectionConfig = pluginConfig?.sectionConfigs?.[item.id] ?? {}

            return (
              <SortableSectionItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                plugin={plugin}
                sectionConfig={sectionConfig}
                onConfigChange={onSectionConfigChange ? (config) => onSectionConfigChange(item.id, config) : undefined}
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}

