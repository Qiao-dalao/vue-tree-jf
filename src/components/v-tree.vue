<template>
	<div class='cus_vtree_wrap' @click.capture='clickNodeWrap'>
		<v-tree-item :treeData='treeData' @clickNodeCom='clickNode' 
		@rightClickCom="rightClickBack" 
		:checkBox='checkBox' 
		:class='{tree_root_lonely:treeData.length === 1}'
		 @toggleCheckBox="checkBoxFun"></v-tree-item>
	</div>
</template>

<script>
	//import Vue from 'vue'
	export default {
		name: 'vue-tree',
		props: ['treeData', 'checkBox'],
		data() {
			return {
				//userData:this.treeData
			}
		},
		mounted() {
			this.initData(true, true, true);
		},
		updated() {
			this.initData(true, true, true);
		},
		methods: {
			initData(expandInit, activeInit, checkedInit) {
				var self = this;
				var modifyDataFun = function(datas) {
					if (datas) {
						datas.forEach((m, index) => {
							if (expandInit) {
								self.$set(m, 'expand', false);
							}
							if (activeInit) {
								self.$set(m, 'active', false);
							}
							if (checkedInit) {
								self.$set(m, 'checked', false);
								self.$set(m, 'partchecked', false);
							}
							if (index === datas.length - 1) {
								self.$set(m, 'last', true);
							}
							if (m.children) {
								modifyDataFun(m.children);
							}
						});
					}
				}
				modifyDataFun(this.treeData);
			},
			clickNode(data) {
				this.$emit('clickNode', data);
			},
			rightClickBack(data){
				this.$emit('rightClickThing',data)
			},
			clickNodeWrap() {
				this.initData(false, true, false);
			},
			checkBoxFun(item) {

			},
			getCheckedNodes() {
				var resultArr = [];
				var getCheckedNodesFun = (datas) => {
					if (datas) {
						datas.forEach((m) => {
							if (m.checked === true) {
								resultArr.push(m);
							}
							if (m.children) {
								getCheckedNodesFun(m.children);
							}
						})
					}
				};
				getCheckedNodesFun(this.treeData);
				return resultArr;
			},
			getRoot() {
				return this.treeData[0];
			},
			findNode(selectedId) {
				var result;
				var findNodeFun = (datas) => {
					if (datas) {
						try {
							datas.forEach((m) => {
								if (m.id === selectedId) {
									result = m;
									throw new Error('stop');
								}
								if (m.children) {
									findNodeFun(m.children);
								}

							});
						} catch (e) {

						}

					}
				};
				findNodeFun(this.treeData);
				return result;
			},
			setSelectedNode(node, clickDiv) {
				var select;
				var that = this;
				var setSelectedFun = (datas) => {
					if (datas) {
						datas.forEach((m) => {
							if (m.id === node.id) {
								m.active = true;
								select = m;
								if (clickDiv) {
									var dom = document.getElementById(m.id);
									if (dom && dom.className.indexOf('cus_item_content') > -1) {
										dom.click();
									} else {
										var doms = document.getElementsByClassName('cus_item_content');
										for (var y = 0; y < doms.length; y++) {
											if (doms[y].id === m.id) {
												doms[y].click();
												break;
											}
										}
									}

								}
							} else {
								m.active = false;
							}
							if (m.children) {
								setSelectedFun(m.children);
							}
						});
					}
				};
				setSelectedFun(this.treeData);
				return select;
			},
			getSelectedNode() {
				var resultNode = null;
				var getSelectedFun = (datas) => {
					if (datas) {
						datas.forEach((m) => {
							if (m.active === true) {
								resultNode = m;
								return;
							}
							if (m.children) {
								getSelectedFun(m.children)
							}
						})
					}
				};
				getSelectedFun(this.treeData);
				return resultNode;
			},
			getParentNode(node) {
				var resultNode = null;
				var getParentNode = (datas, parent) => {
					if (datas) {
						try {
							datas.forEach((m) => {
								if (node && m.id === node.id) {
									resultNode = parent;
									throw new Error("Stop");
								}
								if (!resultNode && m.children) {
									getParentNode(m.children, m);
								}
							});
						} catch (e) {

						}

					}
				}
				getParentNode(this.treeData, null);
				return resultNode;
			},
			getParentNodesArr(node) {
				var resultArr = [];
				var parentNode;
				var getParent = (target) => {
					parentNode = this.getParentNode(target);
					if (parentNode) {
						resultArr.push(parentNode);
						getParent(parentNode);
					}
				};
				getParent(node);
				return resultArr;

			}
		},
		components: {
			'v-tree-item': {
				name: 'v-tree-item',
				template: 
				`<ul class="cus_tree_ul" :class="{cus_tree_ulLine:(treeData && treeData.length)}" style="position:relative;">
					<li v-for="item in treeData" @contextmenu="rightclick(item)">
						<div class="cus_item_content" :title="item.text" @click="clickNode(item)" :id= item.id   :class="{active:item.active}">
							<span class="treeExpandBtn" @click.stop="toggleNode(item)" :class="{butopen:item.expand && item.children,btnclose:!item.expand && item.children,line: !item.last && !item.children,lastLine:item.last&&!item.children}"></span>
							<span class="tree-icon" :class="item.icon"></span>
							<span v-if="checkBox" @click="checkBoxClick(item)" class="cus_chekcbox" :class="{cus_chekcbox_checked:item.checked,cus_chekcbox_part_checked:item.partchecked}"></span>
							<div @dblclick="dbClickHandle(item,$event)"   style="display:inline-block;position:relative;">
								<input type="text" v-model="item.text" :checked="inputDisabled" :disabled="inputDisabled" @blur='closeFocus' class="inputTreeFile" />
							</div>
						</div>
						<v-tree-item :treeData="item.children" @rightClickCom='rightClickCom' v-if="item.expand" @clickNodeCom="clickNodeCom"  :checkBox="checkBox" :class="{cus_checkbox_allchecked:item.checked}" @toggleCheckBox="checkBoxFun(item)" ></v-tree-item> 
					</li>
				</ul>`,
				data(){
					return {
						inputDisabled:true
					}
				},
				methods: {
					clickNode(item) {
						console.log(item,'clickNodeItem')
						item.active = true;
						this.visible = false
						this.$emit('clickNodeCom', item);
					},
					rightclick(item){
						event.preventDefault()
						this.$emit('rightClickCom',item)
					},
					dbClickHandle(item,e){
						this.inputDisabled = false
						// console.log(e)
						// window.getSelection().selectAllChildren(item.text)
						console.log(e.target.focus)
						e.target.focus()
						
						e.target.style.background='white'
						// window.getSelection().selectAllChildren(e.target)
						// console.log(window.getSelection().selectAllChildren(e.target))
			
						// this.inputDisabled = false
					},
					closeFocus(){
						this.inputDisabled=true
						event.target.style.background='none'
					},
					toggleNode(item) {
						item.expand = !item.expand;
						item.active = true;
					},
					clickNodeCom(data) {
						// console.log(213)
						// this.inputDisabled = false
						this.$emit('clickNodeCom', data);
					},
					rightClickCom(data){
						this.$emit('rightClickCom',data);
					},
					checkBoxClick(item) {

						item.partchecked = false;
						item.checked = !item.checked;
						//设置子元素是否勾选
						var checkChildFun = (childrenDatas) => {
							childrenDatas.forEach((m) => {
								m.checked = item.checked;
								if (m.children) {
									checkChildFun(m.children);
								}
							})
						}
						if (item.children) {
							checkChildFun(item.children);
						}


						this.$emit('toggleCheckBox');
					},
					checkBoxFun(item) {
						var checkedNum = 0;
						var partCheckedNum = 0;
						item.children.forEach((li) => {

							if (li.checked === true) {
								checkedNum++;
							} else if (li.partchecked === true) {
								partCheckedNum++;
							}
						})
						if (checkedNum === item.children.length) { //全选
							item.checked = true;
							item.partchecked = false;
						} else if (checkedNum > 0 || partCheckedNum > 0) { //部分勾选
							item.checked = false;
							item.partchecked = true;
						} else { //没有勾选
							item.checked = false;
							item.partchecked = false;
						}

						this.$emit('toggleCheckBox')
					},

				},
				props: ['treeData', 'checkBox']
			}
		}

	}
</script>

<style>
	.cus_vtree_wrap>ul:first-child {
		background-image: none;
	}

	ul.cus_tree_ul {
		padding-left: 16px;
		background-image: url('../images/index.gif');
		background-position: 4px 10px;
		background-repeat: repeat-y;
	}

	li:last-child>ul.cus_tree_ul:last-child {
		background-image: none;
	}

	ul.cus_tree_ul li {
		text-align: left;
		cursor: pointer;
		list-style: none;

	}

	.cus_item_content span.treeExpandBtn {
		display: inline-block;
		width: 18px;
		height: 18px;
		margin-right: 6px;
		background-image: url('../images/zTreeStandard.png');

	}

	.cus_vtree_wrap>ul>li:first-child>.cus_item_content>span.treeExpandBtn.butopen {
		background-position: -92px 0px
	}

	li .cus_item_content span.treeExpandBtn.butopen {
		background-position: -92px -18px
	}

	li:last-child .cus_item_content span.treeExpandBtn.butopen {
		background-position: -92px -36px
	}

	.cus_vtree_wrap ul.tree_root_lonely>li>.cus_item_content>span.treeExpandBtn.butopen {
		background-position: -92px -54px
	}

	.cus_vtree_wrap>ul>li:first-child>.cus_item_content>span.treeExpandBtn.btnclose {
		background-position: -74px -0px
	}

	li .cus_item_content span.treeExpandBtn.btnclose {
		background-position: -74px -18px
	}

	li:last-child .cus_item_content span.treeExpandBtn.btnclose {
		background-position: -74px -36px
	}

	.cus_vtree_wrap ul.tree_root_lonely>li>.cus_item_content>span.treeExpandBtn.btnclose {
		background-position: -74px -54px
	}

	.cus_item_content span.treeExpandBtn.lastLine {
		background-position: -56px -36px
	}

	.cus_item_content span.treeExpandBtn.line {
		background-position: -56px -18px
	}

	.cus_item_content .cus_chekcbox {
		display: inline-block;
		width: 14px;
		height: 14px;
		margin-right: 6px;
		background-image: url('../images/zTreeStandard.png');
		background-position: -0px -0px
	}

	.cus_item_content .cus_chekcbox.cus_chekcbox_checked {
		background-position: -14px -0px
	}

	.cus_item_content .cus_chekcbox.cus_chekcbox_part_checked {
		background-position: 0px -42px
	}

	ul.cus_tree_ul li .cus_item_content {
		padding: 4px;
		white-space: nowrap;
		overflow-x: hidden;
	}

	ul.cus_tree_ul li .cus_item_content:hover {
		background: rgba(0,0,0,0.1);
		color: white
	}

	ul.cus_tree_ul li .cus_item_content.active {
		background: rgba(0,0,0,0.3);
		color: white;
	}

	.folder {
		display: inline-block;
		width: 16px;
		height: 16px;
		margin-right: 6px;
		background-image: url('../images/zTreeStandard.png');
		background-position: -110px -0px
	}

	.file {
		display: inline-block;
		width: 18px;
		height: 18px;
		margin-right: 6px;
		background-image: url('../images/zTreeStandard.png');
		background-position: -110px -30px
	}
	.inputTreeFile{
		border:0;
		background:none;
		outline:none;
	}
</style>
