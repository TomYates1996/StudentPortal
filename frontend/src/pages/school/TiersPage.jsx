import React from "react";
import { Link } from "react-router-dom";

const tiers = [
    { name: "Starter", users: 20, priceMonth: 49, priceYear: 499, features: ["Basic access", "1 admin account"] },
    { name: "Growth", users: 100, priceMonth: 199, priceYear: 1999, features: ["All Starter features", "5 admin accounts", "Priority support"] },
    { name: "Enterprise", users: 1000, priceMonth: 799, priceYear: 7999, features: ["All Growth features", "Unlimited admin accounts", "Dedicated account manager"] }
];

const TiersPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">School Plans & Pricing</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                    <div key={tier.name} className="bg-white rounded shadow p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">{tier.name}</h2>
                        <p className="mb-2">Users: {tier.users}</p>
                        <p className="mb-4">
                            <span className="font-bold">${tier.priceMonth}/month</span> or{" "}
                            <span className="font-bold">${tier.priceYear}/year</span>
                        </p>
                        <ul className="mb-4 list-disc list-inside">
                            {tier.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                        <Link
                            to={`/school/register?tier=${tier.name}`}
                            className="mt-auto bg-blue-600 text-white p-2 rounded text-center hover:bg-blue-700"
                        >
                            Register
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TiersPage;
