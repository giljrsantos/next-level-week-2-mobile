import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import PageHeader from '../../components/PageHeader';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';


import styles from './styles'
import { useFocusEffect } from '@react-navigation/native';




function TeacherList() {

    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [isFilterVisible, setIsFilterVisible] = useState(false);


    const [subject, setSubject] = useState<string>();
    const [weed_day, setWeed_day] = useState<string>();
    const [time, setTime] = useState<string>();

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {

            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map( (teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds);
            }

        });        
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    

    function handleToggleFilterVisible() {
        setIsFilterVisible(!isFilterVisible);
    }

    async function handleFilterSubmit() {

        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                weed_day,
                time,
            }
        });

        setIsFilterVisible(false);
        setTeachers(response.data);

    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys disponíveis" headerRight={(
                <BorderlessButton onPress={handleToggleFilterVisible}>
                    <Feather name="filter" size={20} color="#fff" />
                </BorderlessButton>
            )}>
                {isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>

                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Qual a matéria?"

                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da Semana</Text>
                                <TextInput
                                    style={styles.input}
                                    value={weed_day}
                                    onChangeText={text => setWeed_day(text)}
                                    placeholder="Qual dia?"
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="Qual horário?"
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}

            </ScrollView>

        </View>
    );
}

export default TeacherList;