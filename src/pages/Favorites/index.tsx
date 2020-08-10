import React, { useState, useEffect } from 'react';
import { View, ScrollView, AsyncStorage } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

function Favorites(){

    const [favorites, setFavorites] = useState([]);

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {

            if (response) {
                const favoritedTeachers = JSON.parse(response);

                setFavorites(favoritedTeachers);
            }

        });        
    }

    useFocusEffect(() => {
        loadFavorites();
    })
        
    return (
    <View style={styles.container}>
        <PageHeader title="Meus Proffys Favoritos" />

        <ScrollView 
            style={styles.teacherList}
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16,
            }}
            >
                {favorites.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id}
                            teacher={teacher}
                            favorited={true}
                        />
                    );
                })}
            
            </ScrollView>        
    </View>
    );
}

export default Favorites;