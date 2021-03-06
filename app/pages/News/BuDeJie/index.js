/**
 * @flow
 * Created by Rabbit on 2019-03-05.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, Modal, ActivityIndicator } from 'react-native';

import { TableList } from '../../../components';
import BaseContainer from '../../../components/BaseContainer';

import type { RTBDJList, RTWeal } from '../../../servers/News/interfaces';
import { BuDeJieMobx } from '../../../mobx/News/BuDeJieMobx';
import { inject, observer } from 'mobx-react';
import { BaseItem } from './Components/BaseItem';
import type { NavigationState } from 'react-navigation';
import { ActionSheet, Overlay } from 'teaset';
import { Button, CustomImage } from '../../../components';

import { Picture } from '../../../servers/News/interfaces';
import PlaceholderView from './Components/Views/PlaceholderView';
import type { RTBuDeJieType } from '../../../servers/News';

import { LargeList } from 'react-native-largelist-v3';
import { System } from '../../../utils';
import { PublicStore } from '../../../store/PublicStore';
// import { ChineseWithLastDateFooter } from 'react-native-spring-scrollview/Customize';

type Props = {
  type: RTBuDeJieType | string,
  navigate: NavigationState,
  publicStore: PublicStore
};

@inject('publicStore')
@observer
class BuDeJie extends React.Component<Props, any> {
  buDeJieMobx: BuDeJieMobx;
  customPopView: any;
  _list: LargeList;

  constructor(props: Props) {
    super(props);
    this.buDeJieMobx = new BuDeJieMobx();
  }

  componentDidMount = async () => {
    const { maxtime } = this.buDeJieMobx;
    await this.buDeJieMobx.fetchBuDeJieData(this.props.type, maxtime);
  };

  actionSheetToSaveImage = (url: string) => {
    const { saveImageWithIOS, saveImageWithAndroid } = this.props.publicStore;
    const items = [
      {
        title: '保存图片',
        onPress: () => (System.iOS ? saveImageWithIOS(url) : saveImageWithAndroid(url))
      }
    ];
    const cancelItem = { title: '取消' };
    ActionSheet.show(items, cancelItem);
  };

  picturePress = (item: Picture | any) => {
    if (item.isLongPicture || !item.is_gif) {
      this.props.navigate('WebView', { uri: item.weixin_url });
    } else {
      const overlayView = (
        <Overlay.PopView
          style={{ alignItems: 'center', justifyContent: 'center' }}
          overlayOpacity={1}
          ref={v => (this.customPopView = v)}
        >
          <Button
            onPress={() => this.customPopView && this.customPopView.close()}
            onLongPress={() => this.actionSheetToSaveImage(item.cdn_img)}
          >
            <CustomImage
              source={{ uri: item.cdn_img }}
              resizeMode={'contain'}
              style={{
                backgroundColor: 'black',
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT
              }}
            />
          </Button>
        </Overlay.PopView>
      );
      Overlay.show(overlayView);
    }
  };

  videoPress = (item: Picture) => {
    this.props.navigate('WebView', { uri: item.weixin_url });
  };

  renderItem = ({ section, row }: { section: number, row: number }) => {
    const { navigate } = this.props;
    const { largeListData } = this.buDeJieMobx;

    const item = largeListData[section].items[row];
    // console.log('item-----', item);
    return (
      <BaseItem
        itemData={item}
        navigate={navigate}
        itemPress={() => {
          alert(item.text);
        }}
        picturePress={() => this.picturePress(item)}
        videoPress={() => this.videoPress(item)}
      />
    );
  };

  render() {
    const { largeListData, maxtime } = this.buDeJieMobx;
    return (
      <LargeList
        style={styles.container}
        data={largeListData}
        ref={ref => (this._list = ref)}
        heightForIndexPath={({ section, row }: { section: number, row: number }) => {
          const item: RTBDJList = largeListData[section].items[row];
          return item.itemHeight;
        }}
        renderIndexPath={this.renderItem}
        onRefresh={async () => {
          await this.buDeJieMobx.fetchBuDeJieData(this.props.type, '');
          this._list.endRefresh();
        }}
        // loadingFooter={ChineseWithLastDateFooter}
        onLoading={async () => {
          await this.buDeJieMobx.fetchBuDeJieData(this.props.type, maxtime);
          this._list.endLoading();
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#EEE'
  }
});

export { BuDeJie };
