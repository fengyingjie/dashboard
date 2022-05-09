exports {
    devServer: {
      proxy: {
        '/aposServer': {
            target: 'http://164.69.117.197/tidd/projects/hopej2_j4-1/issues.json?key=649d1585cb17c83ba8f3259818f8b47c11d35790', //API服务器的地址
            changeOrigin: true
        }
    }
    }
  }