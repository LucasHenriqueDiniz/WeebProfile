"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PLUGINS_METADATA } from "@/lib/plugin-metadata"
import { getPluginIcon } from "@/lib/plugins-data"
import { cn } from "@/lib/utils"
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
import React from "react"

interface PluginOrderItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }> | null
  enabled: boolean
}

interface PluginOrderListProps {
  plugins: Record<string, { enabled: boolean }> // Totalmente dinâmico
  pluginsOrder: string[]
  onReorder: (newOrder: string[]) => void
}

function SortablePluginItem({ id, name, icon: Icon, enabled }: PluginOrderItem) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !enabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (!enabled) {
    return null
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
      <CardContent className="p-4 flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        {Icon ? (
          <Icon className="w-5 h-5 text-muted-foreground" />
        ) : (
          <span className="w-5 h-5 text-muted-foreground">•</span>
        )}
        <span className="font-medium flex-1">{name}</span>
        {isDragging && (
          <span className="text-xs text-primary font-semibold">Arrastando...</span>
        )}
      </CardContent>
    </Card>
  )
}

export function PluginOrderList({ plugins, pluginsOrder, onReorder }: PluginOrderListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filtrar apenas plugins habilitados e criar itens dinamicamente
  const enabledPlugins = pluginsOrder
    .filter((id) => plugins[id]?.enabled)
    .map((id) => {
      const metadata = PLUGINS_METADATA[id as keyof typeof PLUGINS_METADATA]
      const icon = getPluginIcon(id)
      return {
        id,
        name: metadata?.displayName || id,
        icon,
        enabled: true,
      }
    })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = enabledPlugins.findIndex((item) => item.id === active.id)
      const newIndex = enabledPlugins.findIndex((item) => item.id === over.id)

      const newEnabledOrder = arrayMove(enabledPlugins, oldIndex, newIndex).map((item) => item.id)

      // Manter plugins desabilitados na ordem original, mas atualizar ordem dos habilitados
      const disabledPlugins = pluginsOrder.filter(
        (id) => !plugins[id]?.enabled
      )
      const newOrder = [...newEnabledOrder, ...disabledPlugins]

      onReorder(newOrder)
    }
  }

  if (enabledPlugins.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Habilite pelo menos um plugin para reorganizar
      </div>
    )
  }

  if (enabledPlugins.length === 1) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Adicione mais plugins para poder reorganizar
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
        items={enabledPlugins.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {enabledPlugins.map((item) => (
            <SortablePluginItem key={item.id} {...item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}







