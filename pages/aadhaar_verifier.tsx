import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import TEST_INPUT from '../lib/const';
import circuit from '../circuits/aadhaar_qr_verifier/target/aadhaar_qr_verifier.json';
import {clearCircuit, generateProof, setupCircuit} from '../lib/noir';
import {Circuit} from '../types';

export default function AadhaarVerifierScreen() {
  const [generatingProof, setGeneratingProof] = useState(false);
  const [provingTime, setProvingTime] = useState(0);
  const onGenerateProof = async () => {
    setGeneratingProof(true);
    try {
      let circuitid = await setupCircuit(circuit as Circuit);

      console.log('Generating proof');
      const start = Date.now();
      const {proofWithPublicInputs} = await generateProof(
        TEST_INPUT,
        circuitid,
        'honk',
      );

      console.log('Proof generated', proofWithPublicInputs);
      const end = Date.now();
      setProvingTime(end - start);
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setGeneratingProof(false);
  };

  return (
    <View>
      <Button
        onPress={async () => {
          await onGenerateProof();
        }}
        title="Anon Aadhaar Circuits"
      />
      <Text>aadhaar_verifier</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
