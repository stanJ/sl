
$(function(){
	frameObj.init();
})
var frameObj = {
	init: function(){
		loadFrame();
	},
}
function loadFrame(){
	var h1 = `<header>
			<nav class="top-nav clearfix">
				<div class="nav-left">
					<a href="channel_draw.html">渠道画像</a>
					<a href="user_analysis.html">用户画像</a>
					<a href="product_analysis.html">产品分析</a>
				</div>
				<div class="btn-keys">
					<div class="triangle-down">
						
					</div>
				</div>
				<div class="nav-right">
					<span class="nr-left">welcome</span>
					<span class="nr-right">3ti</span>
					<span class="icon-exit">&nbsp;</span>
					
				</div>
				
			</nav>
			<div class="keys-wrapper clearfix">
				<div class="kw-left">
					<span class="kwl-add">+ Add</span>
					<span class="kwl-find">Find Content</span>
				</div>
				<div class="kw-right">编辑快捷键</div>
			</div>
		</header>	
		<div class="left-menu">
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-list"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-home"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-user"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-products"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-channel"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-label"></div>
			</div>
			<div class="lm-icon-wrapper">
				<div class="lm-icon icon-analysis"></div>
			</div>
		</div>`;
	$("body").prepend(h1);
	$( ".prs__select" ).selectify({
		btnText: '',
		classes: {
			container: "prs__select sl-container"
		}
	});
	$( ".select" ).each(function(i){
		var className = $(this).attr('class');
		$(this).selectify({
			btnText: '',
			classes: {
				container: className+ ' sl-container'
			}
		});
	})
	$( "select" ).on( "change", function ( ) {
		console.log( "Yes, these events work as they did on the native UI!" );
	});
}