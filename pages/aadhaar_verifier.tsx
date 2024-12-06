import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import circuit from '../circuits/aadhaar_qr_verifier/target/aadhaar_qr_verifier.json';
import TEST_INPUT from '../lib/const';
import {
  clearCircuit,
  extractProof,
  generateProof,
  setupCircuit,
  verifyProof,
} from '../lib/noir';
import {Circuit} from '../types';

export default function AadhaarVerifierScreen() {
  const [generatingProof, setGeneratingProof] = useState(false);
  const [proofAndInputs, setProofAndInputs] = useState('');
  const [provingTime, setProvingTime] = useState(0);
  const [vkey, setVkey] = useState('');
  const [proof, setProof] = useState('');
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [circuitId, setCircuitId] = useState<string>();

  useEffect(() => {
    // First call this function to load the circuit and setup the SRS for it
    // Keep the id returned by this function as it is used to identify the circuit
    setupCircuit(circuit as Circuit).then(id => setCircuitId(id));

    return () => {
      if (circuitId) {
        // Clean up the circuit after the component is unmounted
        clearCircuit(circuitId!);
      }
    };
  }, []);

  const onGenerateProof = async () => {
    setGeneratingProof(true);
    try {
      if (!circuitId) {
        throw new Error('Circuit not set up');
      }

      console.log('Generating proof');
      const start = Date.now();
      const {proofWithPublicInputs, vkey: _vkey} = await generateProof(
        TEST_INPUT,
        circuitId!,
        'honk',
      );

      const end = Date.now();
      setProvingTime(end - start);

      setVkey(_vkey);
      setProofAndInputs(JSON.stringify(proofWithPublicInputs));
      setProof(extractProof(circuit as Circuit, proofWithPublicInputs));
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setGeneratingProof(false);
  };

  const onVerifyProof = async () => {
    setVerifyingProof(true);
    try {
      const verified = await verifyProof(
        proofAndInputs,
        vkey,
        circuitId!,
        'honk',
      );
      if (verified) {
        Alert.alert('Verification result', 'The proof is valid!');
      } else {
        Alert.alert('Verification result', 'The proof is invalid');
      }
    } catch (err: any) {
      Alert.alert('Something went wrong', JSON.stringify(err));
      console.error(err);
    }
    setVerifyingProof(false);
  };

  return (
    <View>
      {circuitId ? (
        <Button
          onPress={async () => {
            await onGenerateProof();
          }}
          disabled={generatingProof}
          title={generatingProof ? 'Generating...' : 'Anon Aadhaar Circuits'}
        />
      ) : (
        <Text>Loading circuit...</Text>
      )}

      {proof && (
        <Button
          onPress={async () => {
            await onVerifyProof();
          }}
          disabled={verifyingProof}
          title={verifyingProof ? 'Verifying...' : 'Verify Proof'}
        />
      )}
      <Text>aadhaar_verifier</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
