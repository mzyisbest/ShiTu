/**
 * @flow
 * Created by Rabbit on 2018/5/4.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';

import {loadBuDeJieData, loadWealPictureData} from "../../../servers/News";
import { TableList } from '../../../components';
import type {RTBDJList, RTWeal} from "../../../servers/News/types";

import {UltimateListView } from 'react-native-ultimate-listview'
type Props = {
  type: number
};
export default class index extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      maxtime: '',
      data: [],
    }
  }

  async componentDidMount() {
    // console.log(await loadBuDeJieData(this.props.type));

    // let data = await loadBuDeJieData(this.props.type, this.state.maxtime);

    // await this.fetchData()

  }

  fetchData = async () => {
    try {
      let data = await loadBuDeJieData(this.props.type, this.state.maxtime);

      console.log(data);

      this.setState({
        maxtime: data.info.maxid,
        data: data.list
      })


    } catch (e) {
      console.log(e)
    }
  }

  onFetch = async ( page: any  , startFetch: any, abortFetch: any) => {
    try {
      // let data = await loadBuDeJieData(this.props.type, value);
      // this.setState({
      //   maxtime: data.info.maxid,
      //   data: data.list
      // })

      let data = await loadWealPictureData(page, "iOS")
      // console.log(data)

      this.setState({
        data: data.results
      })

      // console.log(this.state.data.length);

      startFetch(data.results, 20)

    } catch (e) {
      console.log(e)
    }
  }


  renderItem = ( {item, index}: any ) => {
    // const _item: RTBDJList = item
    return(
      <Text style={{height: 44, marginTop: 10, backgroundColor: '#aaa'}}>{index + '        ' + item.desc}</Text>
    )
  }

  item = (item: RTWeal, index: number) => {
    return(
      <Text style={{height: 44, marginTop: 10, backgroundColor: '#aaa'}}>{index + '        ' + item.desc}</Text>
    )
  }

  render() {
    return (
        <TableList
          style={{backgroundColor: 'white'}}
          onFetch={this.onFetch}
          // item={this.item}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          initialNumToRender={20}
          // paginationType={'value'}
        />
    )
  }
}

{/*<FlatList*/}
  {/*data={this.state.data}*/}
  {/*renderItem={this.renderItem}*/}
  {/*keyExtractor={(item) => item.id}*/}
  {/*ListHeaderComponent={()=><View/>}*/}
  {/*onEndReachedThreshold={0.1}*/}
  {/*onEndReached={this.onEndReached}*/}
{/*/>*/}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});