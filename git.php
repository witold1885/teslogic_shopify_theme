<?php
	$username = 'witold1885';
	$token = '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';
	/*
		git add . && git commit -m "Header" && git push
	*/
	shell_exec('git add .');
	if (isset($argv[1])) {
		shell_exec('git commit -m "' . $argv[1] . '"');
	}
	else {
		shell_exec('git commit -m "Responsive 999-0"');
	}
	shell_exec('git push');
?>