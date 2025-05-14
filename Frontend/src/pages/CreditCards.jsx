import Dropdown from '../components/CreditCards/CompanyDropDown.jsx'
import CardList from '../components/CreditCards/CreditCardList.jsx'
import React, {useState} from "react";
function CreditCards(){
    const [selectedCompany, setSelectedCompany] = useState('');
    return(
        <>
            <Dropdown 
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
            />

            <CardList
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                
            
            />
        
        </>
        
        

    );

}
export default CreditCards;