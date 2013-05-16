(function($) {
	$(document).ready(function() {
		var parent_goal_id = null;
		$(".toolbar").sticky({topSpacing:40});
		$(".toolbar").on('click', '.sub .close', function() {
			parent = $(this).parents(".sub");
			parent.hide(300, function(){ parent.remove();});
			parent_goal_id = null;
		});
		$(".toolbar .basegoal").click(function() {
			if($(".toolbar .sub").length === 0) {
				$.get("/ajax/toolbar/basegoal", function(data) {
					$(".toolbar").append(data).find(".sub").fadeIn('normal');
					$(".toolbar select").chosen();
					$('#datepicker').datepicker({
						format: 'mm-dd-yyyy'
					});
				});
			}
		});
		$(".toolbar").on("click", ".sub .basegoal", function() {
			var data = $(".toolbar form").serialize() + "&parent_id=" + parent_goal_id;
			$.post("/ajax/toolbar/basegoal", data)
			.success(function(result) {
				window.location = window.location;
			}).fail(function(err) {
				console.log(err);
			});
		});

		var highlightActive = false;
		$(".toolbar").on("focus", "#parent_title", function() {
			$(".fullview-container .highlight").toggleClass("on");
			highlightActive = true;
		});
		$(".toolbar").on("focusout", "#parent_title", function() {
			$(".fullview-container .highlight").toggleClass("on");
			if($(this).val() == "") {
				parent_goal_id = null;
			}
			setTimeout(function() {
				highlightActive = false;
			}, 500);
		});
		$(".fullview-container").on("click", ".highlight", function() {
			if(highlightActive === true) {
				parent_goal_id = $(this).data("id");
				$("#parent_title").val($(this).children(".title").text());
			}
		});
		$(".highlight > input[type='checkbox']").change(function() {
			var checked = $(this).is(":checked");
			var goal_id = $(this).parent().data("id");
			console.log("action=" + checked + "&goal_id=" + goal_id);
			$.post("/ajax/toolbar/markgoal", "action=" + checked + "&goal_id=" + goal_id)
			.success(function(result) {
				console.log(result);
			}).fail(function(err) {
				console.log(err);
			});
		});
	});
})(jQuery);