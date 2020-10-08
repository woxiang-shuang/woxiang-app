import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import theme from '../../styles/theme';
export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async UNSAFE_componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.flex1}>
          <Camera style={styles.flex1} type={this.state.type}>
            <View
              style={styles.comwaView}>
              <TouchableOpacity
                style={styles.comea}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={styles.comeratext}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flex1:{ flex: 1 },
  comwaView:{
    flex: 1,
    backgroundColor: theme.backgroundColor.white,
    flexDirection: 'row',
  },
  comea:{
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  comeratext:{ fontSize: 18, marginBottom: 10, color: theme.text.colorWhite }
});