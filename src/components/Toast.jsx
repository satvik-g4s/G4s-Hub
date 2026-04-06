import styles from './Toast.module.css'

export default function Toast({ msg, type }) {
  return (
    <div className={`${styles.toast} ${type === 'err' ? styles.err : styles.ok}`}>
      <i className={`fas ${type === 'err' ? 'fa-exclamation-circle' : 'fa-check-circle'}`} />
      <span>{msg}</span>
    </div>
  )
}
