# salvatore

## 脚手架

1. vue-cli3 理由：配置简单在，只需要添加配置文件vue.config.js

[vue-vli3官方地址](https://cli.vuejs.org/zh/)

2. 使用

`npm install -g @vue/cli`(一定要安装的脚手架3)

`vue create salvatore(项目名称，自定义的)`(然后可以选择第一个没有配置的，建议选择第二个自定义的配置，注意：空格表示选中具体的某一条)

## 组件库

2. 组件库vant 理由：组件全面，配置文件如下

* （1）babel.config.js

  ```js
  plugins: [
    [
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: true },
      'vant'
    ]
  ]
  ```

* （2）vue.config.js

  ```js
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375,
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    }
  }
  ```

* （3）按需引入文件：addVant.js

[vant组件库地址](https://youzan.github.io/vant/#/zh-CN/theme)

.env: ci时候用的信息

.env.development:开发中的host和port可以经行设置

## 加入项目

1. `git clone https://git.iflytek.com/LZX_OfficialDocument/h5-mutil-document.git`

2. `cd h5-mutil-document`

3. `npm i`

4. `npm start`