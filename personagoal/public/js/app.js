(function($) {
	/*
	 * General to the application
	 */
	var parent_goal_id = null;
	$(document).ready(function() {
		$(".toolbar").on('click', '.sub .close', function() {
			parent = $(this).parents(".sub");
			parent.hide(300, function(){ parent.remove();});
			parent_goal_id = null;
		});
	});

	/*
	 * /user/project/* scripts
	 */
	$(document).ready(function() {
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
			var data = $(".toolbar form").serialize() + "&parent_id=" + parent_goal_id 
						+ "&project_id=" + window.project_id;
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
			var item = $(this);
			var checked = item.is(":checked");
			var goal_id = item.parent().data("id");
			$.post("/ajax/toolbar/markgoal", "action=" + checked + "&goal_id=" + goal_id)
			.success(function(result) {
				if(result.success === true) {
					var parent = item.parent().parent();
					if(checked) {
						parent.removeClass("complete-false").addClass("complete-true");						
					} else {
						parent.removeClass("complete-true").addClass("complete-false");	
					}
				}
			}).fail(function(err) {
				console.log(err);
			});
		});
	});

	/*
	 * /user/home scripts
	 */
	$(document).ready(function() {
		$(".toolbar .project").click(function() {
			if($(".toolbar .sub").length === 0) {
				$.get("/ajax/toolbar/project", function(data) {
					$(".toolbar").append(data).find(".sub").fadeIn('normal');
					$(".toolbar select").chosen();
				});
			}
		});
		$(".toolbar").on("click", ".sub .project", function() {
			var data = $(".toolbar form").serialize();
			$.post("/ajax/toolbar/project", data)
			.success(function(result) {
				window.location = window.location;
			}).fail(function(err) {
				console.log(err);
			});
		});
		var catchNextClick = false;
		$(".toolbar .removeproject").click(function() {
			catchNextClick = true;
			$(".projects > .project").addClass("pointer");
			return false;
		});
		$(document).click(function(event) {
			if(catchNextClick) {
				catchNextClick = false;
				$(".projects > .project").removeClass("pointer");
				var project_id = $(event.target).data("project_id");
				if(project_id != undefined) {
					event.preventDefault();
					$.confirm({
						text: "Are you sure you want to delete this project?",
						confirm: function(button) {
							console.log(project_id);
						},
						cancel:function(button) {
							console.log("no");
						},
						confirmButton: "Yes, I am",
						cancelButton: "Oops, no way!",
						post: true
					});
					return false;
				}
			}
		})
	});
})(jQuery);