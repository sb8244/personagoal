(function($) {
	$(document).ready(function() {
		$(".toolbar").on('click', '.sub .close', function() {
			parent = $(this).parents(".sub");
			parent.hide(300, function(){ parent.remove();});
		});
		$(".toolbar .basegoal").click(function() {
			if($(".toolbar .sub").length === 0) {
				$.get("/ajax/toolbar/basegoal", function(data) {
					$(".toolbar").append(data).find(".sub").fadeIn('normal');
					$(".toolbar select").chosen();
				});
			}
		});
	});
})(jQuery);