import styles from './GuestWarning.module.scss'

export const GuestWarning = () => {
  return (
    <div className={styles.warning}>
      <h3>Гостевой режим</h3>
      <p>
        Вы вошли как гость. Некоторые функции будут ограничены.
        Для полного доступа войдите или зарегистрируйтесь.
      </p>
    </div>
    
  )
}