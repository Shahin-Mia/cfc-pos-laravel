<?php

namespace App\Services;

use Exception;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\Printer;

class PrinterService
{
    protected Printer $printer;

    public function __construct(NetworkPrintConnector $connector)
    {
        $this->printer = new Printer($connector);
    }

    public function printReceipt(string $imagePath, $order)
    {
        try {
            $img = EscposImage::load(public_path($imagePath));
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->graphics($img);

            $this->printer->setPrintLeftMargin(50);
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->setTextSize(2, 2); // Double size text for shop name
            $this->printer->text("Chairman Fried Chicken\n");
            $this->printer->feed(1); // Line break

            // === TRANSACTION INFO ===
            if (!empty($order)) {
                $this->printer->setJustification(Printer::JUSTIFY_LEFT);
                $this->printer->text("Date: " . date('Y-m-d H:i:s') . "\n");
                $this->printer->setJustification(Printer::JUSTIFY_CENTER);
                $this->printer->text("Receipt #: {$order['id']}\n");
                $this->printer->feed(1);

                // === ITEM LIST ===

                if (isset($order["cart"])) {
                    $this->printer->setEmphasis(true);
                    $this->printer->text(str_pad("Item", 20) . str_pad("Quantity", 5) . "Price\n");
                    $this->printer->setEmphasis(false);
                    $this->printer->text(str_repeat("-", 32) . "\n");

                    foreach ($order["cart"] as $item) {
                        $line = str_pad($item['title'], 20) .
                            str_pad($item['quantity'], 5) .
                            number_format(($item['sale_price'] * $item['quantity']), 2) . "\n";
                        $this->printer->text($line);
                    }

                    $this->printer->text(str_repeat("-", 32) . "\n");
                }

                // === TOTAL ===
                $this->printer->setEmphasis(true);
                $this->printer->text(str_pad("Total:", 25) . "$" . number_format($order["total_price"], 2) . "\n");
                $this->printer->setEmphasis(false);

                $this->printer->feed(2);
            }

            // === FOOTER ===
            $this->printer->setJustification(Printer::JUSTIFY_CENTER);
            $this->printer->text("Thank you for your purchase!\n");
            $this->printer->text("Visit us again at mylaravelshop.com\n");
            $this->printer->feed(3);

            $this->printer->cut();
            $this->printer->close();
        } catch (Exception $e) {
            throw new Exception("Printing failed: " . $e->getMessage());
        }
    }
}
