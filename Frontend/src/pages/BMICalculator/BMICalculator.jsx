import React, { useState } from 'react';
// import backgroundImage from './images/background.jpg';
// import weightIcon from './images/weight-icon.png';
// import heightIcon from './images/height-icon.png';

const BMICalculator = () => {
    const [weight, setWeight] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [bmiResult, setBMIResult] = useState(null);

    const calculateBMI = () => {
        if (!weight || !heightCm) {
            alert('Please enter both weight and height.');
            return;
        }

        const weightInKg = parseFloat(weight);
        const heightInM = parseFloat(heightCm) / 100; // Convert cm to meters

        if (isNaN(weightInKg) || isNaN(heightInM) || weightInKg <= 0 || heightInM <= 0) {
            alert('Please enter valid weight and height.');
            return;
        }

        const bmi = weightInKg / (heightInM * heightInM);
        setBMIResult(bmi.toFixed(2));
    };

    const backgroundImage = "https://via.placeholder.com/100x300"


    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            minHeight: '75vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '30px',
                border: '2px solid #ef7f1a',
                borderRadius: '8px',
                maxWidth: '400px'
            }}>
                <h2 style={{ color: '#ef7f1a', textAlign: 'center', marginBottom: '30px' }}>BMI Calculator</h2>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <img src="https://via.placeholder.com/50" alt="Weight Icon" style={{ width: '30px', marginRight: '10px' }} />
                    <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <img src="https://via.placeholder.com/50" alt="Height Icon" style={{ width: '30px', marginRight: '10px' }} />
                    <input
                        type="number"
                        placeholder="Height (cm)"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        style={{ padding: '10px', width: '100%', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                </div>
                <button
                    onClick={calculateBMI}
                    style={{
                        backgroundColor: '#ef7f1a',
                        color: 'white',
                        border: 'none',
                        padding: '15px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '20px'
                    }}
                >
                    Calculate BMI
                </button>
                {bmiResult && (
                    <div style={{ textAlign: 'center', fontSize: '20px', color: '#168c46' }}>
                        Your BMI: {bmiResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BMICalculator;
