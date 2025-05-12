import React, { useState, useEffect } from "react";
import styles from '../../assets/creditcard-styles.module.css';
function CreditCardList({selectedCompany, setSelectedCompany}){
    
    const [cards, setCards] = useState([]);
    useEffect(() =>{
        getCards();
    }, [selectedCompany]);

    function getCards(){
        let url = "http://127.0.0.1:8080/api/creditCards";

        if (selectedCompany) {
            url += `?company=${encodeURIComponent(selectedCompany)}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCards(data);
                console.log(data);
                
            })
        .catch((error) => {
            console.error("Error fetching credit Cards:", error);
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