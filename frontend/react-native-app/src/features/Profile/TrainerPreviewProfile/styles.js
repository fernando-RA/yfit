import {StyleSheet, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 5,
    position: 'relative',
  },
  wrapper: {
    maxHeight: 300,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width,
    flex: 1,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontSize: 12,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  paginationText: {
    color: 'white',
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: width,
    padding: 16,
  },
  highlightedText: {
    color: '#5A76AB',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    position: 'absolute',
    bottom: 40,
  },
  editButtonText: {
    paddingHorizontal: 18,
    color: '#5A76AB',
    fontWeight: '800',
  },
  takePhoto: {
    height: 300,
    width: width,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    marginBottom: 10,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  modal: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 20,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  linkBodyText: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  linkTitleText: {
    marginBottom: 13,
    // fontFamily: 'Chivo',
    fontWeight: 'bold',
    fontSize: 32,
  },
});
