import React from "react";
import { Link } from "react-router-dom";

const tiers = [
    { name: "Starter", teachers: 3 , students: 20, classes: 5, priceMonth: 50, priceYear: 499, features: ["Buy Courses", "Assign Classes"] },
    { name: "Growth", teachers : 10, students: 100, classes: 10, priceMonth: 150, priceYear: 1999, features: ["All Starter features", "Priority support"] },
    { name: "Enterprise", teachers : 50, students: 1000, classes: 100, priceMonth: 500, priceYear: 7999, features: ["All Growth features", "Dedicated account manager", "Access to free courses"] }
];

const TiersPage = () => {
    return (
        <div className="page tiers-page">
            <h1 className="big-header">Price Plans</h1>
            <div className="tiers-inner">
                {tiers.map((tier) => (
                    <div key={tier.name} className="tier-item">
                        <h2 className="tier-title">{tier.name}</h2>
                        <p className="tier-price">
                            <span className="">*£{tier.priceMonth} per month</span>
                            {/* <span className="">£{tier.priceYear}/year</span> */}
                        </p>
                        <div className="tier-features-wrapper">
                            <p>Teachers: {tier.teachers}</p>
                            <p>Students: {tier.students}</p>
                            <p>Classes: {tier.classes}</p>
                            <h4>Features</h4>
                            <ul className="tier-features">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <Link
                            to={`/school/register?tier=${tier.name}`}
                            className="base-btn tier-btn"
                        >
                            Choose Tier
                        </Link>
                    </div>
                ))}
            </div>
            <p>*Payment will be taken automatically on the last day of every month, cancel at any time.</p>
        </div>
    );
};

export default TiersPage;
