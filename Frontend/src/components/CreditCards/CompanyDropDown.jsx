
import styles from '../../assets/creditcard-styles.module.css';
function CreditCardDropDownMenu({selectedCompany, setSelectedCompany}){
    const handleChange = (e) => {
        setSelectedCompany(e.target.value);
        console.log("Value selected");
    };
    return(
        /* Will be changed when database is connected */
        <div className={styles.selectCompanyContainer}>
            <select className={styles.dropdown} value={selectedCompany} onChange={handleChange}>
            <option value="">All Companies</option>
            <option value="Chase">Chase</option>
            <option value="American Express">American Express</option>
            <option value="Bank of America">Bank of America</option>
            </select>     
            {console.log("Company Selected: ", selectedCompany)}
        </div>
        
        
        
        
    )
    
}
export default CreditCardDropDownMenu;
