<?php

class Popover extends HTMLComponent {

    public function __construct($outputCSS = false) {
        $this->componentName = "Popover";
        $this->description   = "Bootstrap Popover with custom icon.";
        $this->status   = "ready";


        $this->defaultParams         = array();
        $this->defaultParams['base'] = array("ilicon-chevron-down", array("Properties", "Remove User", "Move to", "<hr>", "Permissions", "Multi-user Coverage Report", "<hr>", randomLipsum(50),array(array("<input type='checkbox' name='ch-ex'>", "Checkbox Example"))), "","Action");
        $this->defaultParams['top-right'] = array("ilicon-chevron-down", array("Menu Item 1", "Menu Item 2", "Menu Item 3", "Menu Item 4", "LONG MENU Item 5 - LOREM IPSUM", array(array("<input type='checkbox' name='ch-ex'>", "Checkbox Example"), array("<input type='checkbox' name='ch-ex'>", "Checkbox Example"), array("<input type='checkbox' name='ch-ex'>", "Checkbox Example"))), "popover-left popover-top","Action");
        

        parent::__construct($outputCSS);
    }

    private function showOption($option) {
        if (!is_array($option)) {
            if (strpos($option, "<input") === false) {
                echo "<a class='dismiss'>" . $option . "</a>";
            } else {
                echo $option;
            }
        } else {
            foreach ($option as $node) {
                if (is_array($node) && !is_array($node[0])) {
                    echo "<div><label>";
                    $labCheck = 0;
                }
                $this->showOption($node);
                if (is_array($node) && !is_array($node[0])) {
                    echo "</label></div>";
                    $labCheck = -1;
                }
            }
        }
    }

    public function render($echo = false, $paramArr = false) {
        if ($paramArr === false) {
            $paramArr = $this->defaultParams['base'];
        }
        
        if(!isset($paramArr[3])){
            $paramArr[3] = "Action";
        }
        $ILIcon = new ILIcon(true);

        ob_start();
        ?>
        <button type="button" data-toggle="popover" class="btn btn-primary btn-stripped popover-btn<?php if (!empty($paramArr[2])) {
            echo " " . $paramArr[2];
            } ?>"><?php echo $paramArr[3];?>
                <?php $ILIcon->render(true, array($paramArr[0])); ?>
        </button>
        <div class="popover-content hidden">
            <ul class="toolbar-items"><?php
                if (!empty($paramArr[1])) {
                    foreach ($paramArr[1] as $option) {
                        if (!is_array($option) && strpos($option, "<hr") === 0) {
                            echo "<li class='disable'><hr></li>";
                        } else {
                            if (!is_array($option)) {
                                echo "<li>";
                            } else {
                                echo "<li class='disable'>";
                            }
                            $this->showOption($option);
                            echo "</li>";
                        }
                    }
                }
                ?>
            </ul>
        </div><?php
        $this->setComponentHTML(ob_get_contents());
        ob_end_clean();
        if ($echo) {
            echo $this->getComponentHTML();
        }
    }

}
