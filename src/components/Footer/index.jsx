import "./style.css"

export const Footer = ({
  onExportBackup,
  onImportClick,
  importInputRef,
  onImportBackup,
}) => {
  return <footer className="footer">
     <div className="footer__meta">
       <p>© Iveta Círová</p>
       {onExportBackup && onImportClick && (
         <div className="footer__data-tools">
           <span className="footer__label">Správa dat:</span>
           <button type="button" className="footer__link" onClick={onExportBackup}>
             Export JSON
           </button>
           <span className="footer__sep">|</span>
           <button type="button" className="footer__link" onClick={onImportClick}>
             Import JSON
           </button>
           <input
             ref={importInputRef}
             type="file"
             accept="application/json"
             className="visually-hidden"
             onChange={onImportBackup}
           />
         </div>
       )}
     </div>
  </footer>
  
}
