  import styles from './ToolGrid.module.css'
  import { useState, useEffect, useRef } from "react"



  import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
  } from "@dnd-kit/core"

  import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable
  } from "@dnd-kit/sortable"

  import { CSS } from "@dnd-kit/utilities"

  /* ========================= */
  /* MAIN GRID */
  /* ========================= */



  export default function ToolGrid({
    cards,
    adminMode,
    onDelete,
    onNoUrl,
    onEdit,
    onReorder
  }) {

    const [items, setItems] = useState(cards)
    const draggedRef = useRef(false)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
      setItems(cards)
    }, [cards])

    /* 🔥 SENSOR FIX (click vs drag) */
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8   // 👈 KEY FIX
        }
      })
    )

    const handleDragEnd = (event) => {
      const { active, over } = event

      if (!over) return

      if (active.id !== over.id) {
        draggedRef.current = true   // 🔥 mark drag

        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)

        const newArr = arrayMove(items, oldIndex, newIndex)

        setItems(newArr)
        onReorder && onReorder(newArr)
      }
    }

    if (!items.length) {
      return (
        <div className={styles.grid}>
          <div className={styles.empty}>
            <i className="fas fa-search" />
            <p>No items found</p>
          </div>
        </div>
      )
    }

    // ✅ NORMAL MODE (NO DRAG)
    if (!adminMode) {
      return (
        <div className={styles.grid}>
          {items.map((card, i) => (
            <ToolCard
              key={card.id}
              card={card}
              index={i}
              adminMode={adminMode}
              onDelete={onDelete}
              onNoUrl={onNoUrl}
              onEdit={onEdit}
            />
          ))}
        </div>
      )
    }

    // ✅ ADMIN MODE (DRAG ENABLED)
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(event) => {
          setIsDragging(false)
          handleDragEnd(event)
        }}
      >
        <SortableContext
          items={items.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className={styles.grid}>
            {items.map((card, i) => (
              <SortableCard
                key={card.id}
                id={card.id}
                card={card}
                index={i}
                adminMode={adminMode}
                onDelete={onDelete}
                onNoUrl={onNoUrl}
                onEdit={onEdit}
                draggedRef={draggedRef}
                isDragging={isDragging}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  /* ========================= */
  /* SORTABLE WRAPPER */
  /* ========================= */

  function SortableCard({ id, card, index, draggedRef, ...props }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: props.adminMode
        ? (isDragging ? 'grabbing' : 'grab')
        : 'pointer'
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(props.adminMode ? attributes : {})}
        {...(props.adminMode ? listeners : {})}
      >
        <ToolCard card={card} index={index} draggedRef={draggedRef} {...props} />
      </div>
    )
  }

  /* ========================= */
  /* CARD */
  /* ========================= */

  function ToolCard({
    card,
    index,
    adminMode,
    onDelete,
    onNoUrl,
    onEdit,
    isDragging
  }) {

    const handleClick = (e) => {

      // 🚫 block clicks during drag
      if (isDragging) {
        e.preventDefault()
        return
      }

      if (!card.url) {
        e.preventDefault()
        onNoUrl()
      }
    }

    return (
      <a
        className={styles.card}
        href={adminMode ? undefined : card.url}
        target={adminMode ? undefined : (card.target || "_blank")}
        rel="noreferrer"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={handleClick}
      >
        <div className={styles.icon}>
          <i className={`fas ${card.icon}`} />
        </div>

        <div className={styles.content}>
          <div className={styles.cat}>
            {card.category || 'General'}
          </div>

          <div className={styles.title}>
            {card.name}
          </div>
        </div>

        {adminMode && (
          <>
            {/* DELETE */}
            <button
              className={styles.del}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(card.id)
              }}
            >
              <i className="fas fa-trash" />
            </button>

            {/* EDIT */}
            <button
              style={{
                position: 'absolute',
                top: 9,
                right: 38,
                background: 'rgba(59,130,246,.1)',
                border: '1px solid rgba(59,130,246,.2)',
                borderRadius: 5,
                color: '#3b82f6',
                width: 24,
                height: 24
              }}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onEdit(card)
              }}
            >
              <i className="fas fa-pen" />
            </button>
          </>
        )}
      </a>
    )
  }
