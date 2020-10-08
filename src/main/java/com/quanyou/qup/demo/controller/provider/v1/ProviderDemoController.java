package com.quanyou.qup.demo.controller.provider.v1;

import com.quanyou.qup.core.bean.base.ResponseEntity;
import com.quanyou.qup.demo.dto.DemoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Demo
 *
 * @author 抓抓匠
 * @since 2020-06-10
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/provider/v2/demo")
public class ProviderDemoController {

    @PostMapping
    public ResponseEntity create(@Valid @RequestBody DemoDTO dto) {
        return ResponseEntity.success();
    }

    @PutMapping
    public ResponseEntity update(@Valid @RequestBody DemoDTO dto) {
        return ResponseEntity.success();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable String id) {
        return ResponseEntity.success();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemoDTO> query(@PathVariable String id) {
        return ResponseEntity.success();
    }
}