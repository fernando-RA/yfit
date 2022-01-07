import {StyleSheet, Dimensions} from 'react-native';
import DimensionUtils from '../../utils/DimensionUtils';
const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 5,
    position: 'relative',
  },
  root: {
    flex: 1,
    width: '100%',
    marginBottom: 115,
    paddingHorizontal: 15,
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
    justifyContent: 'center',
    width: width,
    position: 'absolute',
    bottom: 0,
    height: 108,
    paddingTop: 15,
    backgroundColor: '#f2f2f2',
    borderTopColor: '#DBDBDB',
    borderTopWidth: 1,
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
});
