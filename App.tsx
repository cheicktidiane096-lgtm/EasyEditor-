import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('Ton texte ici');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const viewRef = React.useRef<View>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      Alert.alert('Permission refusée', 'Il faut autoriser l\'accès aux photos');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const saveImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status!== 'granted') {
      Alert.alert('Permission refusée', 'Il faut autoriser l\'accès à la galerie');
      return;
    }
    try {
      const uri = await captureRef(viewRef, { format: 'png', quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Sauvé!', 'Image enregistrée dans ta galerie');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  const colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>1. Choisir une photo</Text>
      </TouchableOpacity>

      <View ref={viewRef} style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {image && <Text style={[styles.overlayText, { color: textColor }]}>{text}</Text>}
      </View>

      {image && (
        <>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Tape ton texte"
          />
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorBtn, { backgroundColor: c }]}
                onPress={() => setTextColor(c)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={saveImage}>
            <Text style={styles.buttonText}>2. Sauvegarder l'image</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', paddingTop: 50 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, marginVertical: 10, width: '90%' },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  imageContainer: { width: '90%', height: 400, backgroundColor: '#333', marginVertical: 20, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  overlayText: { position: 'absolute', fontSize: 30, fontWeight: 'bold', textShadowColor: 'black', textShadowRadius: 5 },
  input: { backgroundColor: 'white', width: '90%', padding: 10, borderRadius: 8, marginBottom: 10 },
  colorRow: { flexDirection: 'row', marginBottom: 20 },
  colorBtn: { width: 40, height: 40, borderRadius: 20, margin: 5, borderWidth: 2, borderColor: 'white' },
});