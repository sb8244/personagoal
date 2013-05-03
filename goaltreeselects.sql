Steps of this query:
	1. Get all of the goals the user directly owns
	2. Get all of the children of goals that the user owns
	3. Get all of the parents of goals that the user owns
	4. Can limit to a certain tree based on the root

Inserting a goal into the tree requires the root node of the tree to be known. It can bubble down,
so that a goal just takes the root node field from the parent

Nodes can not be deleted easily as of now, trees will be segregated in this case, maybe the best
idea is to just delete all subnodes

SELECT * FROM 
(
	SELECT DISTINCT User_Goal.user_id, Goal.goal_id, title, due_date, NULL as parent_id, NULL as child_id, root FROM User_Goal 
		JOIN Goal ON User_Goal.goal_id = Goal.goal_id
		LEFT OUTER JOIN GoalTreeChildren ON Goal.goal_id = GoalTreeChildren.goal_id OR Goal.goal_id = GoalTreeChildren.child_id
		JOIN Task ON Goal.task_id = Task.task_id
		WHERE User_Goal.user_id = 1

	UNION

	SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.goal_id as goal_id, title, due_date, null as parent_id, GoalTreeChildren.child_id as child_id, root FROM User_Goal
		JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.child_id
		JOIN Goal ON GoalTreeChildren.child_id = Goal.goal_id
		JOIN Task ON Goal.task_id = Task.task_id 
		WHERE User_Goal.user_id = 1

	UNION

	SELECT DISTINCT User_Goal.user_id, GoalTreeChildren.child_id as goal_id, title, due_date, GoalTreeChildren.goal_id as parent_id, null as child_id, root FROM User_Goal
		JOIN GoalTreeChildren ON User_Goal.goal_id = GoalTreeChildren.goal_id
		JOIN Goal ON GoalTreeChildren.goal_id = Goal.goal_id
		JOIN Task ON Goal.task_id = Task.task_id 
		WHERE User_Goal.user_id = 1

)	
a
ORDER BY goal_id