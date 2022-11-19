import React, { useEffect, useState, Image } from 'react';
import { io } from 'socket.io-client';
import { View, Text, Pressable, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { Feather } from "@expo/vector-icons";
import ChatComponent from './ChatComponent';







const Chat = () => {

    const socket = io.connect("http://localhost:4000");

    const [rooms, setRooms] = useState([]);


// useLayoutEffect(() => {
//     function fetchGroups() {
//         fetch("http://localhost:4000/api")
//             .then((res) => res.json())
//             .then((data) => setRooms(data))
//             .catch((err) => console.error(err));
//     }
//     fetchGroups();
// }, []);

useEffect(() => {
    socket.on("roomsList", (rooms) => {
        setRooms(rooms);
    });
}, [socket]);

    return (
        <SafeAreaView style={styles.chatScreen}>
            <View style={styles.chatTopContainer}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatHeading}>Chats</Text>

            {/* 👇🏻 Logs "ButtonPressed" to the console when the icon is clicked */}
                    <Pressable onPress={() => console.log("Button Pressed!")}>
                        <Feather name='edit' size={24} color='green' />
                    </Pressable>
                </View>
    
                
            </View>
            

            <View style={styles.chatListContainer}>
                {rooms.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item }) => <ChatComponent item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.chatEmptyContainer}>
                        <Text style={styles.chatEmptyText}>No rooms created!</Text>
                        <Text>Click the icon above to create a Chat room</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    usersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    user: {
        width: 100,
        height: 10,
        margin: 8, 
        borderRadius: 50,
        borderWidth: 2,
        padding: 3,
        borderColor: '#202020'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50
    },
    chatScreen: {
        backgroundColor: "#202020",
        flex: 1,
        padding: 10,
        position: "relative",
    },
    chatHeading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    chatTopContainer: {
        backgroundColor: "#202020",
        height: 70,
        width: "100%",
        padding: 20,
        justifyContent: "center",
        marginBottom: 15,
        elevation: 2,
    },
    chatHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    chatListContainer: {
        paddingHorizontal: 10,
        
    },
    chatEmptyContainer: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
    },
    chatEmptyText: { fontWeight: "bold", fontSize: 24, paddingBottom: 30 },
    messagingscreen: {
        flex: 1,
    },

});

export default Chat;