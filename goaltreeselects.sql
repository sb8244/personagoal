SELECT * FROM 
(
	SELECT User_Goal.user_id, Goal.goal_id, title, due_date, NULL as parent_id, NULL as child_id, root FROM User_Goal 
		JOIN Goal ON User_Goal.goal_id = Goal.goal_id
		LEFT OUTER JOIN GoalTreeChildren ON Goal.goal_id = GoalTreeChildren.goal_id OR Goal.goal_id = GoalTreeChildren.child_id
		JOIN Task ON Goal.task_id = Task.task_id
		WHERE User_Goal.user_id = 1

	UNION

	SELECT User_Goal.user_id, GoalTreeChildren.goal_id as goal_id, title, due_date, null, GoalTreeChildren.child_id as child_id, root FROM User_Goal
		JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.child_id
		JOIN Goal ON GoalTreeChildren.child_id = Goal.goal_id
		JOIN Task ON Goal.task_id = Task.task_id 

	UNION

	SELECT User_Goal.user_id, GoalTreeChildren.child_id as goal_id, title, due_date, GoalTreeChildren.goal_id as parent_id, null, root FROM User_Goal
		JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.goal_id
		JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id
		JOIN Task ON Goal.task_id = Task.task_id 

)	
a
ORDER BY goal_id