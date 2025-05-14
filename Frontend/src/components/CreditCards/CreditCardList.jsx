import React, { useState, useEffect } from "react";
import styles from '../../assets/creditcard-styles.module.css';
function CreditCardList({selectedCompany, setSelectedCompany}){
    
    const [cards, setCards] = useState([]);
    useEffect(() =>{
        getCards();
    }, [selectedCompany]);

    function getCards() {
        let url = "/assets/creditCards.json"; 

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                
                const filteredCards = selectedCompany 
                    ? data.filter(card => card.company === selectedCompany)
                    : data;

                setCards(filteredCards);
                console.log(filteredCards);
            })
            .catch((error) => {
                console.error("Error fetching credit cards:", error);
    });
}
    

    return(
        <div className="row row-cols-md-3 g-3 p-4">
                {cards.map((card) => (
                    <div className="col">
                        <div className={`${styles.creditCardContent} ${styles.card} col`} key={card.name}>
                    
                            <div className={styles.creditCardNameContainer}>
                                 <p><strong>{card.name}</strong></p>
                            </div>

                            <div className={styles.imageContainer}>
                                <img src={`${card.imageURL}`} alt={`${card.name} Image`}/>
                            </div>

                            <div className={styles.creditCardCompanyContainer}>
                                <p>{`${card.company}`}</p>
                            </div>

                            <div className={styles.benefitsContainer}>
                                <ul className={styles.CreditCardBenefits}>
                                    {card.benefits.map((benefit) => (
                                        <li key={benefit}><p>{benefit}</p></li>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div> 
                
                    
                ))}
        </div>
    )

}
export default CreditCardList;