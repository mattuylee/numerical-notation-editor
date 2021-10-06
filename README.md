# Web简谱编辑器
一个Web版简谱编辑器，支持一键转调和图片导出。

## 在线Demo
[Github Page](https://mattuylee.github.io/numerical-notation-editor/)

[示例曲子：烟雨](https://mattuylee.github.io/numerical-notation-editor/editor/?loadExample)

## 功能
* 所见即所得，支持常见简谱元素
* 全键盘输入音符，高效快速
* 一键转调，避免出错
* 高清图片导出

## 使用
暂时未兼容移动端，要使用此程序的完整功能，必须连接键盘。详情的使用介绍请见[Wiki](https://github.com/mattuylee/numerical-notation-editor/wiki/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B)。

## RoadMap
- [x] 转调
- [ ] 歌词
- [ ] 分节符
- [ ] 滑音符号
- [ ] 伴奏
- [ ] 自动保存
- [ ] PWA

不会支持的特性：
- 五线谱

已经存在很多专业还免费的五线谱编辑器，请移步[MuseScore](https://musescore.org)。

## 构建
```shell
git clone https://github.com/mattuylee/numerical-notation-editor
cd numerical-notation-editor && npm install
# 运行
npm run start
# 编译
npm run build
```
要部署Github Page，将编译的`build`目录放到`docs`下并重命名为`editor`。

## Q&A
[Wiki](https://github.com/mattuylee/numerical-notation-editor/wiki)

## 贡献
欢迎提交[issue](https://github.com/mattuylee/numerical-notation-editor/issues/new)或PR。
