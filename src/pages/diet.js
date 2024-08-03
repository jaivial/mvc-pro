import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Select from 'react-select';
import DynamicPDFDownloadLink from '../components/DynamicPDFDownloadLink';
import DynamicPDFViewer from '../components/DynamicPDFViewer';
import { PDFViewer } from '@react-pdf/renderer';
import MealPDF from '../components/MealPDF';
import '../app/globals.css';
import Image from 'next/image';
import { AiOutlineHome, AiOutlineLogout } from 'react-icons/ai';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function Diet() {
    const router = useRouter();
    const [diets, setDiets] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState({});
    const [mealType, setMealType] = useState(1);

    const handleLogout = async () => {
        let { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error logging out:", error.message);
        } else {
            router.push('/login');
        }
    };

    const fetchDiets = async (type) => {
        const { data, error } = await supabase
            .from('diet')
            .select('*')
            .eq('tipocomida', type);
        if (error) {
            console.error(error);
        } else {
            setDiets(data);
        }
    };

    useEffect(() => {
        fetchDiets(mealType);
    }, [mealType]);

    const handleSelectChange = (selectedOption, section) => {
        setSelectedMeals(prev => ({
            ...prev,
            [section.type]: selectedOption ? { ...selectedOption, tipocomida: section.type } : null
        }));
    };

    const mealOptions = diets.map(diet => ({
        value: diet.id,
        label: diet.descripcion,
        ...diet
    }));

    const sections = [
        { type: 1, name: 'Desayuno' },
        { type: 2, name: 'Almuerzo' },
        { type: 3, name: 'Comida' },
        { type: 4, name: 'Merienda' },
        { type: 5, name: 'Cena' },
        { type: 6, name: 'Snack' }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="flex justify-center items-center bg-black py-4">
                <Image
                    src="/mvc-pro_logo.png"
                    alt="mvc-pro logo"
                    width={150}
                    height={150}
                    className="cursor-pointer"
                    onClick={() => router.push('/home')}
                />
            </nav>
            <div className="container mx-auto pb-32">
                {sections.map((section) => (
                    <div key={section.type} className="flex flex-col items-center justify-center mb-10">
                        <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
                        <Select
                            options={mealOptions.filter(diet => diet.tipocomida === section.type)}
                            onChange={(option) => handleSelectChange(option, section)}
                            isClearable
                            placeholder={`Seleccionar ${section.name}`}
                            className="text-black w-[86%]"
                            onMenuOpen={() => setMealType(section.type)}
                        />
                        {selectedMeals[section.type] && (
                            <div className="relative group mt-9 w-[86%]">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-lg blur opacity-75"></div>
                                <div className="relative px-7 py-4 bg-black rounded-lg leading-none flex flex-col items-center space-x-4">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-lg">{selectedMeals[section.type].descripcion}</p>
                                        <div className="min-w-28 h-px bg-white mx-4 mt-4"></div>
                                        <div className="flex flex-row items-center justify-center gap-6 mt-4">
                                            <div className="flex flex-col items-left justify-center gap-4">
                                                <p className="text-left">Hidratos: {selectedMeals[section.type].hidratos} g</p>
                                                <p className="text-left">Proteinas: {selectedMeals[section.type].proteinas} g</p>
                                                <p className="text-left">Grasas: {selectedMeals[section.type].grasas} g</p>
                                            </div>
                                            <div>
                                                <p className="text-left">Calorias: {selectedMeals[section.type].calorias} kcal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div className="flex justify-center mt-10">
                    <DynamicPDFDownloadLink
                        document={<MealPDF selectedMeals={selectedMeals} />}
                        fileName="meal_plan.pdf"
                        className="px-6 py-3 bg-slate-50 rounded-lg text-black"
                    >
                        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
                    </DynamicPDFDownloadLink>
                </div>
            </div>
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex justify-around items-center">
                <button onClick={() => router.push('/home')} className="text-white text-2xl">
                    <AiOutlineHome />
                </button>
                <button onClick={() => router.push('/diet')} className="text-white text-2xl">
                    <GiMeal />
                </button>
                <button onClick={() => router.push('/training')} className="text-white text-2xl">
                    <GiWeightLiftingUp />
                </button>
                <button onClick={handleLogout} className="text-white text-2xl">
                    <AiOutlineLogout />
                </button>
            </nav>
        </div>
    );
}
