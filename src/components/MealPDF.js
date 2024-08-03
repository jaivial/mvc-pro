import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 0,
        backgroundColor: 'black',
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    logoContainer: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        width: '100%',
        paddingHorizontal: 80,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
    },
    mealTitle: {
        fontSize: 12,
        marginBottom: 5,
        color: 'white',
    },
    text: {
        fontSize: 12,
        marginBottom: 2,
        lineHeight: 1.4,
        color: 'white',
    },
    textTitle: {
        fontSize: 16,
        marginBottom: 5,
        lineHeight: 1.4,
        textDecoration: 'underline',
        color: 'white',
    },
    nutritionContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        marginTop: 15,
    },
    macrosContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    totalNutritionContainer: {
        display: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        padding: 10,
        marginTop: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalNutritionText: {
        fontSize: 12,
        color: 'white',
        lineHeight: 1.4,
    },
});

// Helper function to map tipocomida to meal names
const getMealName = (tipocomida) => {
    switch (tipocomida) {
        case 1:
            return 'Desayuno';
        case 2:
            return 'Almuerzo';
        case 3:
            return 'Comida';
        case 4:
            return 'Merienda';
        case 5:
            return 'Cena';
        case 6:
            return 'Snack';
        default:
            return '';
    }
};

// Helper function to calculate total nutrients
const calculateTotals = (selectedMeals) => {
    return Object.values(selectedMeals).reduce(
        (totals, meal) => {
            if (meal) {
                totals.hidratos += meal.hidratos || 0;
                totals.proteinas += meal.proteinas || 0;
                totals.grasas += meal.grasas || 0;
                totals.calorias += meal.calorias || 0;
            }
            return totals;
        },
        { hidratos: 0, proteinas: 0, grasas: 0, calorias: 0 }
    );
};

// Create Document Component
const MealPDF = ({ selectedMeals }) => {
    const totals = calculateTotals(selectedMeals);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Image src="/mvc-pro_logo.png" style={styles.logo} />
                </View>
                <Text style={styles.title}>DIETA PERSONALIZADA</Text>
                {Object.values(selectedMeals).map((meal, index) => (
                    meal && (
                        <View key={index} style={styles.section}>
                            <View>
                                <Text style={styles.textTitle}>{getMealName(meal.tipocomida)}</Text>
                            </View>
                            <View>
                                <Text style={styles.mealTitle}>{meal.descripcion}</Text>
                            </View>
                            <View style={styles.nutritionContainer}>
                                <View style={styles.macrosContainer}>
                                    <Text style={styles.text}>Hidratos: {meal.hidratos} g</Text>
                                    <Text style={styles.text}>Proteínas: {meal.proteinas} g</Text>
                                    <Text style={styles.text}>Grasas: {meal.grasas} g</Text>
                                </View>
                                <View>
                                    <Text style={styles.text}>Calorías: {meal.calorias} kcal</Text>
                                </View>
                            </View>
                        </View>
                    )
                ))}
                <View style={styles.totalNutritionContainer}>
                    <Text style={styles.totalNutritionText}>MACRONUTRIENTES TOTALES:</Text>
                    <View style={styles.totalNutritionContainer}>
                        <Text style={styles.totalNutritionText}>Hidratos: {totals.hidratos} g</Text>
                        <Text style={styles.totalNutritionText}>Proteínas: {totals.proteinas} g</Text>
                        <Text style={styles.totalNutritionText}>Grasas: {totals.grasas} g</Text>
                    </View>
                    <View>
                        <Text style={styles.totalNutritionText}>Calorías: {totals.calorias} kcal</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default MealPDF;
