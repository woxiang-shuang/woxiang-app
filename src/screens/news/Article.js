import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

function getPageImageUrls() {
  return `
    <script>
      ;(function() {
        var startTime = 0;
        var timer = null;
        function getImageUrls() {
          var imageUrls = [];
          var elImages = document.querySelectorAll('img');
          if (elImages) {
            elImages.forEach(function(img) {
              imageUrls.push({url: img.getAttribute('src')});
            })
          }
          return imageUrls;
        }
        function removeRepeat(imageUrls, curImageUrl) {
          for (var i = 0; i < imageUrls.length; i++) {
            if (imageUrls[i].url === curImageUrl) {
              imageUrls.splice(i, 1);
              break;
            }
          }
          imageUrls.unshift({url: curImageUrl});
          return imageUrls;
        }
        function handler(event) {
          if (Date.now() - startTime > 200) return;
          if (event.target && event.target.tagName == 'IMG') {
            var imageUrls = getImageUrls();
            var curImageUrl = event.target.getAttribute('src');
            imageUrls = removeRepeat(imageUrls, curImageUrl);
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'image', imageUrl: imageUrls}));
          }
        }
        document.addEventListener('touchstart', function(event) {
          startTime = Date.now();
        });
        document.addEventListener('touchend', function(event) {
          handler(event);
        });
      })();
    </script>
  `;
}

function toHTML(content) {
  // padding-left:5%;padding-right:5%;marign-left:auto;marign-right:auto;
  // border:1px solid red;
  let html = `<!DOCTYPE html>
    <html>
      <head> 
        <meta charset=utf-8>
        <meta name=viewport content='width=device-width,initial-scale=1'>
        <style>
          html, body { margin: 0; padding: 0; }
          video { width:100%;padding-left:3%;padding-right:3%; box-sizing: border-box;}
          img { width:100%;padding-left:1%;padding-right:1%; box-sizing: border-box;}
          content {height: 200px}
        </style>
      </head>
      <body>
        ${content}
        ${getPageImageUrls()}
      </body>
    </html>`;
  return html;
}

function Article(props) {
  function onMessage(event) {
    let msg = event.nativeEvent.data;
    props.onMessage && props.onMessage(msg);
  }
  function onSizeUpdated(size) {
    props.onMessage && props.onMessage(size);
  }
  return (
    <AutoHeightWebView
      style={styles.autoHeightStyle}
      onSizeUpdated={onSizeUpdated}
      scrollEnabled={false}
      files={[
        {
          href: 'cssfileaddress',
          type: 'text/css',
          rel: 'stylesheet',
        },
      ]}
      source={{ html: toHTML(props.content) }}
      scalesPageToFit={true}
      originWhitelist={['*']}
      onMessage={onMessage}
    />
  );
}

const styles = StyleSheet.create({
  autoHeightStyle: {
    width: Dimensions.get('window').width - 20
  }
});

export default Article;
