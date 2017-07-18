<?php
/** @var $_ array */
/** @var $l \OCP\IL10N */
/** @var $theme OC_Theme */
// @codeCoverageIgnoreStart
if(!isset($_)) {//also provide standalone error page
	require_once '../../lib/base.php';
	
	$tmpl = new OC_Template( '', '404', 'guest' );
	$tmpl->printPage();
	exit;
}
// @codeCoverageIgnoreEnd
?>
<?php if (isset($_['content'])): ?>
	<?php print_unescaped($_['content']) ?>
<?php else: ?>
	<ul>
		<li class="error">
			The share expired
			<p class="hint"><?php p($l->t('The admin set an expiration date which is already over. If you need access to the share please ask the person who provided the link to change the expiration date.'));?></p>
			<p class="hint"><a href="<?php p(\OC::$server->getURLGenerator()->linkTo('', 'index.php')) ?>"><?php p($l->t('You can click here to return to %s.', [$theme->getName()])); ?></a></p>
		</li>
	</ul>
<?php endif; ?>
