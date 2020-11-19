import vueTree from './components/v-tree'

	vueTree.install=function(Vue){
		Vue.component(vueTree.name,vueTree);
	}

export default vueTree;