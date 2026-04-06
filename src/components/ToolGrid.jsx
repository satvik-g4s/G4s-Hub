import styles from './ToolGrid.module.css'

export default function ToolGrid({ cards, adminMode, onDelete, onNoUrl, onEdit }) {
  if (!cards.length) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <i className="fas fa-search" />
          <p>No tools found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {cards.map((card, i) => (
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

function ToolCard({ card, index, adminMode, onDelete, onNoUrl, onEdit }) {
  const handleClick = (e) => {
    if (card.url === '#') { e.preventDefault(); onNoUrl() }
  }

  return (
    <a
      className={styles.card}
      href={card.url}
      target={card.target}
      rel="noreferrer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handleClick}
    >
      <div className={styles.icon}>
        <i className={`fas ${card.icon}`} />
      </div>
      <div className={styles.cat}>{card.category}</div>
      <div className={styles.title}>{card.name}</div>

      {adminMode && (
      <>
        <button
          className={styles.del}
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(card.id)
          }}
          title="Delete"
        >
          <i className="fas fa-trash" />
        </button>

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
          title="Edit"
        >
          <i className="fas fa-pen" />
        </button>
      </>
    )}
    </a>
  )
}
