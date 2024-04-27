// import React, { useState } from 'react';
// import {
//     Container,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Button,
// } from '@mui/material';
// import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import data from '../../Utils/GeneralHealthProblems.json'; // Import your JSON data

// const HealthProblems = () => {
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [selectedSymptoms, setSelectedSymptoms] = useState([]);

//     const handleCategoryChange = (categoryName) => {
//         setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
//     };

//     const toggleSymptom = (symptom) => {
//         const isSelected = selectedSymptoms.includes(symptom);
//         if (isSelected) {
//             setSelectedSymptoms(selectedSymptoms.filter((item) => item !== symptom));
//         } else {
//             setSelectedSymptoms([...selectedSymptoms, symptom]);
//         }
//     };

//     const handleSubmit = () => {
//         console.log('Selected Diseases:', selectedSymptoms);
//     };

//     const StyledCard = ({ isSelected, onClick, children }) => (
//         <Card
//             sx={{
//                 marginBottom: '16px',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.3s ease',
//                 backgroundColor: isSelected ? '#ffd1a8' : 'inherit',

//             }}
//             onClick={onClick}
//         >
//             <CardContent>{children}</CardContent>
//         </Card>
//     );

//     return (
//         <Container>
//             <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
//                 Health Problems Categorized
//             </Typography>

//             <Grid container spacing={2} mt={3}>
//                 {data.categories.map((category) => (
//                     <Grid item xs={12} key={category.name}>
//                         <Accordion expanded={selectedCategory === category.name} onChange={() => handleCategoryChange(category.name)}>
//                             <AccordionSummary className='generalHealthCategoriesCard' expandIcon={<ExpandMoreIcon />}>
//                                 <Typography variant="h6">{category.name}</Typography>
//                             </AccordionSummary>
//                             <AccordionDetails>
//                                 <Grid container spacing={2}>
//                                     {category.symptoms.map((symptom) => (
//                                         <Grid item xs={12} sm={6} key={symptom}>
//                                             <StyledCard
//                                                 isSelected={selectedSymptoms.includes(symptom)}
//                                                 onClick={() => toggleSymptom(symptom)}
//                                             >
//                                                 <Typography variant="body1">
//                                                     {symptom
//                                                         .replace(/_/g, ' ')
//                                                         .split(' ')
//                                                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                                                         .join(' ')}
//                                                 </Typography>
//                                             </StyledCard>
//                                         </Grid>
//                                     ))}
//                                 </Grid>
//                             </AccordionDetails>
//                         </Accordion>
//                     </Grid>
//                 ))}
//             </Grid>

//             <div className='generalHealthButton'>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmit}
//                     disabled={selectedSymptoms.length === 0}
//                 >
//                     Submit
//                 </Button>
//             </div>
//         </Container>
//     );
// };

// export default HealthProblems;


import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Button,
} from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledCard from './StyledCard';
import axios from 'axios';

import data from '../../Utils/GeneralHealthProblems.json';

const HealthProblems = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const handleCategoryChange = (categoryName) => {
        setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    };

    const toggleSymptom = (symptom) => {
        const isSelected = selectedSymptoms.includes(symptom);
        if (isSelected) {
            setSelectedSymptoms(selectedSymptoms.filter((item) => item !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleSubmit = async () => {
        console.log('Selected Diseases:', selectedSymptoms);
        const route = "http://localhost:8000/general-health-prediction";

        const formData = new FormData();
        formData.append("symptoms", selectedSymptoms);

        try{
            const response = axios.post(route, formData);

            if (response.status === 200){
                const data = response.json();
                console.log(data.result); 
            }
            else{
                console.log("Error in response");
            }
        }
        catch(error){
            console.log('Error occurred while sending data to server:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Health Problems Categorized
            </Typography>

            <Grid container spacing={2} mt={3}>
                {data.categories.map((category) => (
                    <Grid item xs={12} key={category.name}>
                        <Accordion expanded={selectedCategory === category.name} onChange={() => handleCategoryChange(category.name)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">{category.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {category.symptoms.map((symptom) => (
                                        <Grid item xs={12} sm={6} key={symptom}>
                                            <StyledCard
                                                isSelected={selectedSymptoms.includes(symptom)}
                                                onToggle={() => toggleSymptom(symptom)}
                                            >
                                                {symptom
                                                    .replace(/_/g, ' ')
                                                    .split(' ')
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(' ')}
                                            </StyledCard>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                ))}
            </Grid>

            <div className='generalHealthButton'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={selectedSymptoms.length === 0}
                >
                    Submit
                </Button>
            </div>
        </Container>
    );
};

export default HealthProblems;
