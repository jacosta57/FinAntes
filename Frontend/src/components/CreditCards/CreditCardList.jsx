import React, {useState} from "react";
import '../../assets/creditCard-styles.css';
function CreditCardList({selectedCompany, setSelectedCompany}){
    const testData = [
        {
            "name": "Chase Freedom Unlimited® Credit Card",
            "company": "Chase",
            "benefits": [
                "NEW CARDMEMBER OFFER: Earn a $200 bonus after you spend $500 on purchases in the first 3 months from account opening.",
                "Unlimited 1.5% cash back is just the beginning. Earn unlimited 1.5% cash back or more on all purchases, like 3% on dining and drugstores and 5% on travel purchased through Chase TravelSM",
                "0% intro APR for 15 months from account opening on purchases and balance transfers. After the intro period, a variable APR of 19.49%-28.24%. Balance transfer fee applies, see pricing and terms for more details.",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_unlimited_card_alt.png"
        },
        {
            "name": "Chase Freedom Flex® Credit Card",
            "company": "Chase",
            "benefits": [
                "NEW CARDMEMBER OFFER: Earn a $200 bonus after you spend $500 on purchases in the first 3 months from account opening.",
                "Earn 5% cash back on up to $1,500 on combined purchases in bonus categories each quarter you activate. Plus, earn 5% cash back on travel purchased through Chase TravelSM, 3% on dining and drugstores, and 1% on all other purchases.",
                "0% intro APR for 15 months from account opening on purchases and balance transfers. After the intro period, a variable APR of 19.49%-28.24%. Balance transfer fee applies, see pricing and terms for more details.",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_flex_card_alt.png"
        },
        {
            "name": "Chase Freedom Rise® Credit Card",
            "company": "Chase",
            "benefits": [
                "CARDMEMBER REWARDS: Start building credit while earning 1.5% cash back on all purchases.",
                "Best for: New to Credit and Students. Increase your chances of getting approved for Chase Freedom Rise® by having at least $250 in any Chase checking or savings account before applying.",
                "25.99% variable APR.",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/freedom_rise_alt_card2.png"
        },
        {
            "name": "Chase Sapphire Preferred® Credit Card",
            "company": "Chase",
            "benefits": [
                "NEW CARDMEMBER OFFER: Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening.",
                "Earn 5x total points on travel purchased through Chase TravelSM, excluding hotel purchases that qualify for the $50 Annual Chase Travel Hotel Credit. Earn 3x points on dining at restaurants including eligible delivery services, takeout and dining out. Earn 2x on other travel purchases.",
                "20.49%–27.49%  variable APR",
                "ANNUAL FEE: $95"
            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_preferred_card.png"
        },
        {
            "name": "Chase Sapphire Reserve® Credit Card",
            "company": "Chase",
            "benefits": [
                "NEW CARDMEMBER OFFER: Earn 60,000 bonus points after you spend $4,000 on purchases in the first 3 months from account opening.",
                "Earn 5x total points on flights and 10x total points on hotels (excluding The EditSM) and car rentals when you purchase travel through Chase TravelSM after the first $300 is spent on travel purchases annually.",
                "21.49%–28.49% variable APR.",
                "ANNUAL FEE: $550 annual fee; $75 for each authorized user"

            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/sapphire_reserve_card.png"
        },
        {
            "name": "Slate Edge® Credit Card",
            "company": "Chase",
            "benefits": [
                "NEW CARDMEMBER OFFER: Save on interest with a low intro APR for 18 months. Enjoy a low intro APR on purchases and balance transfers for 18 months from account opening.",
                "Lower your interest rate by 2% each year. You will automatically be considered for an APR reduction by 2% when you pay on time and spend at least $1,000 on your card by your next account anniversary.",
                "0% intro APR for 18 months from account opening on purchases and balance transfers.† After the intro period, a variable APR of 19.49%–28.24%.† Balance transfer fee applies, see pricing and terms for more details.",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://creditcards.chase.com/content/dam/jpmc-marketplace/card-art/slate_edge_card_alt.png"
        },

        {
            "name": "The Platinum Card®",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn 80,000 Membership Rewards® points after you spend $8,000 on purchases on your new Card in your first 6 months of Card Membership.",
                "20.24% to 29.24% variable APR on eligible charges.",
                "ANNUAL FEE: $695"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/pentagon/amx/cns/amx-cns-platinum@480w.webp"
        },
        {
            "name": "American Express® Gold Card",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn 60,000 Membership Rewards® Points after you spend $6,000 on eligible purchases on your new Card within the first 6 months of Card Membership. This offer may not be available if you leave this web page and return later.",
                "20.24% to 29.24% variable APR on eligible charges.",
                "ANNUAL FEE: $325"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/amx/cns/stacked/amx-cns-gold-stacked@480w.webp"
        },
        {
            "name": "Blue Cash Everyday® Card from American Express",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn $200 Back after you spend $2,000 in purchases on your new Card within the first 6 months of Card Membership. You will receive the $200 back in the form of a statement credit.",
                "Intro APR 0%; intro APR on purchases and balance transfers for 15 months from the date of account opening, then a variable APR, 18.24% to 29.24%.",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/amx/cns/amx-cns-bce@480w.webp"
        },
        {
            "name": "American Express® Green Card",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn 40,000 Membership Rewards® Points after you spend $3,000 on purchases on your new Card in your first 6 months of Card Membership.",
                "20.24% to 28.24% variable APR on eligible charges.",
                "ANNUAL FEE: $150"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/amx/cns/amx-cns-green@480w.webp"
        },
        {
            "name": "Marriott Bonvoy Bevy™ American Express® Card",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn 85,000 Marriott Bonvoy® Bonus Points after you use your new Card to make $5,000 in purchases within the first 6 months of Card Membership.",
                "19.99% to 28.99% variable APR on purchases.",
                "ANNUAL FEE: $250"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/mrt/cns/right/mrt-cns-bevy-right@480w.webp"
        },
        {
            "name": "Marriott Bonvoy Brilliant® American Express® Card",
            "company": "American Express",
            "benefits": [
                "WELCOME OFFER: Earn 95,000 Marriott Bonvoy® Bonus Points after you use your new Card to make $6,000 in purchases within the first 6 months of Card Membership.",
                "19.99% to 28.99% variable APR on purchases.",
                "ANNUAL FEE: $650"
            ],
            "imageURL": "https://card.americanexpress.com/imgs/opt/cards/mrt/cns/right/mrt-cns-bonvoy-right@480w.webp"
        },

        {
            "name": "Customized Cash Rewards",
            "company": "Bank of America",
            "benefits": [
                "$200 online cash rewards bonus after making at least $1,000 in purchases in the first 90 days of account opening",
                "Earn 3% cash back in the category of your choice",
                "Low Intro APR on purchases and qualifying balance transfers for 15 billing cycles",
                "ANNUAL FEE: $0"
                
            ],
            "imageURL": "https://promo.bankofamerica.com/ccsearchlp10/compare-cards-3/static.166/media/card-customizedcashrewards.ba17bb4ae3207d7f754d.png"
        },
        {
            "name": "Unlimited Cash Rewards",
            "company": "Bank of America",
            "benefits": [
                "$200 online cash rewards bonus after making at least $1,000 in purchases in the first 90 days of account opening",
                "Earn unlimited 1.5% cash back on all purchases",
                "Low Intro APR on purchases and qualifying balance transfers for 15 billing cyclesFootnote",
                "ANNUAL FEE: $0"
            ],
            "imageURL": "https://promo.bankofamerica.com/ccsearchlp10/compare-cards-3/static.166/media/card-unlimitedcashrewards.c83a1d6565d13482054a.png"
        }
    ]

    const filteredCards = 
        selectedCompany === ''
        ? testData :
        testData.filter((card) => card.company ===selectedCompany);
        

    return(
        <div className="row row-cols-md-3 g-3 p-4">
                {filteredCards.map((card) => (
                    <div className="col">
                        <div className="creditCardContent card col" key={card.name}>
                    
                            <div className="creditCardNameContainer">
                                 <p><strong>{card.name}</strong></p>
                            </div>

                            <div className="imageContainer">
                                <img src={`${card.imageURL}`} alt={`${card.name} Image`}/>
                            </div>

                            <div className="creditCardCompanyContainer">
                                <p>{`${card.company}`}</p>
                            </div>

                            <div className="benefitsContainer">
                                <ul className="CreditCardBenefits">
                                    {card.benefits.map((benefit) => (
                                        <div key={benefit}><p>{benefit}</p></div>
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