import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCO7tUzN-EsTcHEN6-_Dm8hOBjkbyKZElg",
    authDomain: "rn-firebase-2d3a1.firebaseapp.com",
    databaseURL: "https://rn-firebase-2d3a1.firebaseio.com",
    storageBucket: "rn-firebase-2d3a1.appspot.com",
};
// let firebaseApp;
// if (firebase.apps.length === 0) {
let firebaseApp = firebase.initializeApp(firebaseConfig);
// }
const itemsRef = firebaseApp.database().ref('/ToDo');

function ToDoApp(props) {
    let [text, setText] = useState('')
    let [list, setList] = useState([])
    let [isUpdating, setIsUpdating] = useState(false)
    let [currentKey, setCurrentKey] = useState('')

    useEffect(async () => {
        fetchData()
    }, [])

    function addTextHandle(key) {
        if (!isUpdating) {
            itemsRef.push({ text })
            setText('')
            setIsUpdating(false)
            fetchData()
        }
        if (isUpdating) {
            itemsRef.child(currentKey).update({ text: text })
            setText('')
            setIsUpdating(false)
            fetchData()
        }
        // isUpdating && console.log('udpating'), setIsUpdating(false)
    }

    function fetchData() {
        let item = []
        itemsRef.on('value', function (snapshot) {
            let b_ = snapshot.val()
            for (let a_ in b_) {
                console.log(a_)
                console.log(b_[a_].text)
                item.push({ text: b_[a_].text, key: a_ })
            }
            setList(item)
        })
    }

    function handleDelete(key) {
        itemsRef.child(key).remove();
        fetchData()
    }

    function handleUpdate(key, text) {
        setIsUpdating(true)
        setText(text)
        setCurrentKey(key)
    }
    return (

        <View style={{ flex: 1, padding: 10 }}>
            {console.log(list, "list")}
            <TextInput placeholder='Enter your text' style={{ height: 50, marginBottom: 10, borderWidth: 0.5, borderRadius: 5 }} value={text} onChangeText={(e) => setText(e)} />
            <Button title={isUpdating ? 'Update' : 'Add'} onPress={addTextHandle} />
            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                {list.length > 0 && list.map((item, index) => {
                    console.log(item, "item")
                    return (
                        <View style={{ flexDirection: 'row', padding: 10, borderWidth: 0.5, marginBottom: 10 }}>
                            <Text style={{ flex: 0.70 }}>
                                {item.text}
                            </Text>
                            <TouchableOpacity style={{ marginRight: 10, borderWidth: 1 }} onPress={() => handleDelete(item.key)}>
                                <Text style={{ flex: 0.15, textAlign: 'center' }}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 10, borderWidth: 1 }} onPress={() => handleUpdate(item.key, item.text)}>
                                <Text style={{ flex: 0.15, textAlign: 'center' }}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        MainContainer:
        {
            flex: 1,
            borderWidth: 4,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: (Platform.OS === 'ios') ? 20 : 0
        },

        bottomView: {
            width: '100%',
            height: 50,
            backgroundColor: '#FF9800',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0
        },

        textStyle: {
            color: '#fff',
            fontSize: 22
        }
    });
export default ToDoApp