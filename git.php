<?php
	$username = 'witold1885';
	// $token = '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';
	// $token = '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';
	// $token = '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';
	// $token = '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';
	// $token = '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';
	$token = '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';
	// $token = ' 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';
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