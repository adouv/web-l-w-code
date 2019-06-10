import { Component, OnInit } from '@angular/core';
import { MapOptions } from 'angular2-baidu-map';
import { loadScript } from '../../../../assets/script/loadScript';

declare let BMapLib: any;
declare let BMAP_ANCHOR_TOP_RIGHT: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public opts: MapOptions;
  public isShowSet: boolean = false;
  public BMap: any;
  public marker: any;
  constructor() {

  }
  ngOnInit() {
    this.opts = {
      centerAndZoom: {
        lat: 40.134589,
        lng: 116.662322,
        zoom: 10
      },
      minZoom: 12,
      enableKeyboard: true,
      enableScrollWheelZoom: true
    };
    this.marker = {
      point: {
        lat: 40.134589,
        lng: 116.662322,
      }
    }
  }
  loadMap(map: any) {
    this.BMap = window.BMap;
    loadScript().then(win => {
      //加载鼠标绘制工具
      loadScript().then(win => {
        let drawingManager: any;
        drawingManager = new (<any>win).BMapLib.DrawingManager(map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: true, // 是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new (<any>win).BMap.Size(5, 5), // 偏离值
          }
        });
        drawingManager.addEventListener('overlaycomplete', (e) => {
          let thisOverlay = e.overlay;
          console.log(thisOverlay);
          if(thisOverlay.wQ === 'Marker'){
            this.marker.point = thisOverlay.getPosition();
            map.removeOverlay(thisOverlay);
          }else{
            this.isShowSet = true;
            console.log(thisOverlay.getPath())
          }
        });
      });
    })
    window.addEventListener('resize',()=>{
      console.log(1);
    })



  }

}
