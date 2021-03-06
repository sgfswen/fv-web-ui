/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ColouringBookGame from 'games/colouring-book'

/**
* Play games
*/
export default class ColouringBook extends Component {

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
    this.gameContainer = null;
  }

  /**
   * componentDidMount
   */
  componentDidMount () {

    //Setup default asset paths
    const defaultAssetsPath = '/assets/games/colouring-book/assets';
    const defaultLibsPath = `${defaultAssetsPath}/libs`;
    const defaultImagesPath = `${defaultAssetsPath}/images`;

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */

    let gameConfig = {

        libs:{
            bitmapDataFloodFill:`${defaultLibsPath}/BitmapDataFloodFill.js`,
            blob:`${defaultLibsPath}/Blob.js`,
            canvasToBlob:`${defaultLibsPath}/CanvasToBlob.js`,
            fileSaver:`${defaultLibsPath}/FileSaver.js`
        },

        images:{
            preloaderLoading:`${defaultImagesPath}/loading.png`,
            preloaderLogo:`${defaultImagesPath}/logo.png`,
            swatch:`${defaultImagesPath}/swatch.png`,
            selected:`${defaultImagesPath}/selected.png`,
            print:`${defaultImagesPath}/print.png`,
            save:`${defaultImagesPath}/save.png`,
            picture1:`${defaultImagesPath}/picture1.png`,
            picture2:`${defaultImagesPath}/picture2.png`,
            picture3:`${defaultImagesPath}/picture3.png`,
            picture4:`${defaultImagesPath}/picture4.png`,
            thumb1:`${defaultImagesPath}/thumb1.png`,
            thumb2:`${defaultImagesPath}/thumb2.png`,
            thumb3:`${defaultImagesPath}/thumb3.png`,
            thumb4:`${defaultImagesPath}/thumb4.png`
        }

    };


    /**
     * Create the game, with container and game config
     */
    const gameContainerNode = ReactDOM.findDOMNode(this.gameContainer);
    ColouringBookGame.init(gameContainerNode, gameConfig);
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount () {
      ColouringBookGame.destroy();
  }


  /**
   * Render
   */
  render() {

    //Setup game styles
    const gameContainerStyles = {
      maxWidth:800,
      margin:'auto'
    }

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Colouring Book</h1>
                <div style={gameContainerStyles}  ref={(el)=>{this.gameContainer = el}} ></div>
              </div>
            </div>
        </div>;
  }
}