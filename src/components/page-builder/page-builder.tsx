'use client'

import { useState, useCallback } from 'react'
// import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
// import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { PageComponent, ComponentData } from '@/types/page-builder'
import { SortableComponent } from './sortable-component'
import { ComponentEditor } from './component-editor'
import { ComponentToolbar } from './component-toolbar'
import { Button } from '@/components/ui/button'
import { Save, Eye, Plus } from 'lucide-react'

interface PageBuilderProps {
  initialComponents?: PageComponent[]
  onSave?: (components: PageComponent[]) => void
  onPreview?: (components: PageComponent[]) => void
}

export function PageBuilder({ 
  initialComponents = [], 
  onSave, 
  onPreview 
}: PageBuilderProps) {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents)
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    setComponents((items) => {
      const newItems = [...items]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      
      // Update order values
      return newItems.map((item, index) => ({
        ...item,
        order: index
      }))
    })
  }, [])

  const addComponent = useCallback((type: PageComponent['type']) => {
    const newComponent: PageComponent = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: components.length,
      data: getDefaultComponentData(type)
    }

    setComponents(prev => [...prev, newComponent])
    setSelectedComponent(newComponent)
    setIsEditing(true)
  }, [components.length])

  const updateComponent = useCallback((id: string, data: ComponentData) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, data } : comp
      )
    )
  }, [])

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
      setIsEditing(false)
    }
  }, [selectedComponent])

  const duplicateComponent = useCallback((component: PageComponent) => {
    const newComponent: PageComponent = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: components.length
    }

    setComponents(prev => [...prev, newComponent])
  }, [components.length])

  const handleSave = useCallback(() => {
    onSave?.(components)
  }, [components, onSave])

  const handlePreview = useCallback(() => {
    onPreview?.(components)
  }, [components, onPreview])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <ComponentToolbar onAddComponent={addComponent} />
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-full">
            {components.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add components from the toolbar above to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {components.map((component, index) => (
                  <SortableComponent
                    key={component.id}
                    component={component}
                    index={index}
                    isSelected={selectedComponent?.id === component.id}
                    onSelect={() => {
                      setSelectedComponent(component)
                      setIsEditing(true)
                    }}
                    onDelete={() => deleteComponent(component.id)}
                    onDuplicate={() => duplicateComponent(component)}
                    onMoveUp={index > 0 ? () => moveComponent(index, index - 1) : undefined}
                    onMoveDown={index < components.length - 1 ? () => moveComponent(index, index + 1) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Editor Sidebar */}
      {isEditing && selectedComponent && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Component</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <ComponentEditor
              component={selectedComponent}
              onChange={(data) => updateComponent(selectedComponent.id, data)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function getDefaultComponentData(type: PageComponent['type']): ComponentData {
  switch (type) {
    case 'hero':
      return {
        title: {
          nl: 'Welkom bij Ons Portfolio',
          fr: 'Bienvenue dans Notre Portfolio'
        },
        subtitle: {
          nl: 'Ontdek unieke handgemaakte stukken gemaakt met kwaliteitsmaterialen en aandacht voor detail.',
          fr: 'Découvrez des pièces artisanales uniques fabriquées avec des matériaux de qualité et une attention aux détails.'
        },
        heroButtonText: {
          nl: 'Bekijk Projecten',
          fr: 'Voir les Projets'
        },
        heroButtonLink: '/projects',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    case 'text':
      return {
        content: {
          nl: 'Voeg hier uw tekstinhoud toe...',
          fr: 'Ajoutez votre contenu textuel ici...'
        },
        alignment: 'left',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    case 'image':
      return {
        imageUrl: '',
        alt: {
          nl: 'Afbeelding beschrijving',
          fr: 'Description de l\'image'
        },
        caption: {
          nl: '',
          fr: ''
        },
        backgroundColor: '#ffffff'
      }
    case 'gallery':
      return {
        images: [],
        backgroundColor: '#ffffff'
      }
    case 'cta':
      return {
        heading: {
          nl: 'Klaar om Uw Project te Starten?',
          fr: 'Prêt à Commencer Votre Projet?'
        },
        description: {
          nl: 'Neem contact met ons op om uw ideeën te bespreken en te leren hoe we uw visie tot leven kunnen brengen.',
          fr: 'Contactez-nous pour discuter de vos idées et apprendre comment nous pouvons donner vie à votre vision.'
        },
        ctaButtonText: {
          nl: 'Contact Opnemen',
          fr: 'Nous Contacter'
        },
        ctaButtonLink: '/contact',
        backgroundColor: '#000000',
        textColor: '#ffffff'
      }
    case 'spacer':
      return {
        height: 60,
        backgroundColor: '#ffffff'
      }
    default:
      return {}
  }
}